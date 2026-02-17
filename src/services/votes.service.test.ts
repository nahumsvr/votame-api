import { describe, expect, it, mock, beforeEach } from "bun:test";
import { VotesService } from "./votes.service";

// Mock the db module
const mockSelect = mock(() => ({}));
const mockFrom = mock(() => ({}));
const mockWhere = mock(() => ({}));
const mockLimit = mock(() => Promise.resolve([] as any[]));
const mockInsert = mock(() => ({}));
const mockValues = mock(() => Promise.resolve());
const mockDelete = mock(() => ({}));
const mockUpdate = mock(() => ({}));
const mockSet = mock(() => ({}));

// Store the mock state
let mockExistingVote: any = null;
let mockScoreResult: any = [{ total: 0 }];

// Reset and setup mock chain
const setupMocks = () => {
  mockLimit.mockImplementation(() =>
    Promise.resolve(mockExistingVote ? [mockExistingVote] : []),
  );
  mockWhere.mockImplementation(() => ({ limit: mockLimit }));
  mockFrom.mockImplementation(() => ({ where: mockWhere }));
  mockSelect.mockImplementation((selectArg?: any) => {
    // If selecting score (has 'total' key)
    if (selectArg && "total" in selectArg) {
      return {
        from: () => ({
          where: () => Promise.resolve(mockScoreResult),
        }),
      };
    }
    return { from: mockFrom };
  });
  mockValues.mockImplementation(() => Promise.resolve());
  mockInsert.mockImplementation(() => ({ values: mockValues }));
  mockSet.mockImplementation(() => ({ where: () => Promise.resolve() }));
  mockUpdate.mockImplementation(() => ({ set: mockSet }));
  mockDelete.mockImplementation(() => ({ where: () => Promise.resolve() }));
};

// Mock the db import
mock.module("../db", () => ({
  db: {
    select: mockSelect,
    insert: mockInsert,
    delete: mockDelete,
    update: mockUpdate,
  },
}));

describe("VotesService", () => {
  beforeEach(() => {
    mockExistingVote = null;
    mockScoreResult = [{ total: 0 }];
    setupMocks();
  });

  describe("vote", () => {
    it("should create a new vote when no existing vote is found", async () => {
      mockExistingVote = null;
      setupMocks();

      const result = await VotesService.vote(1, "user123", 1);

      expect(result).toEqual({ action: "created", points: 1 });
    });

    it("should update an existing vote when a different vote value is provided", async () => {
      mockExistingVote = { id: 1, postId: 1, userName: "user123", points: 1 };
      setupMocks();

      const result = await VotesService.vote(1, "user123", 3);

      expect(result).toEqual({ action: "changed", points: 3 });
    });

    it("should remove an existing vote when the same vote value is provided (toggle off)", async () => {
      mockExistingVote = { id: 1, postId: 1, userName: "user123", points: 1 };
      setupMocks();

      const result = await VotesService.vote(1, "user123", 1);

      expect(result).toEqual({ action: "removed", points: 0 });
    });
  });

  describe("getPostScore", () => {
    it("should return the correct aggregated score for a post", async () => {
      mockScoreResult = [{ total: 15 }];
      setupMocks();

      const result = await VotesService.getPostScore(1);

      expect(result).toBe(15);
    });

    it("should return 0 when no votes exist", async () => {
      mockScoreResult = [{ total: 0 }];
      setupMocks();

      const result = await VotesService.getPostScore(999);

      expect(result).toBe(0);
    });
  });
});
