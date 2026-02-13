# Votame API

API backend construida con **Bun**, **ElysiaJS**, **Drizzle ORM** y **PostgreSQL**.

## Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu sistema:

- [Bun](https://bun.sh/) (v1.0 o superior)
- [Docker](https://www.docker.com/) y Docker Compose

## Configuración e Instalación

1.  **Instalar dependencias:**

    Ejecuta el siguiente comando para instalar las dependencias del proyecto:

    ```bash
    bun install
    ```

2.  **Configurar Variables de Entorno:**

    Crea un archivo `.env` en la raíz del proyecto. Este archivo debe contener la cadena de conexión a la base de datos que coincida con la configuración de Docker.

    Puedes copiar el siguiente contenido en tu archivo `.env`:

    ```env
    # Conexión a la base de datos (coincide con docker-compose.yml)
    DATABASE_URL=postgres://user_admin:my_password@localhost:5432/post_app_db
    ```

3.  **Iniciar la Base de Datos con Docker:**

    Levanta el contenedor de PostgreSQL utilizando Docker Compose:

    ```bash
    docker compose up -d
    ```

    Esto iniciará una instancia de PostgreSQL en el puerto `5432` con las credenciales configuradas en `docker-compose.yml`.

4.  **Sincronizar la Base de Datos (Drizzle ORM):**

    Una vez que la base de datos esté corriendo, debes sincronizar el esquema de Drizzle con la base de datos:

    ```bash
    bun run db:push
    ```

    > Este comando utiliza `drizzle-kit push` para aplicar los cambios del esquema directamente a la base de datos.

    Si prefieres generar archivos de migración SQL, puedes usar:

    ```bash
    bun run db:generate
    ```

5.  **Ver y Administrar Datos (Opcional):**

    Puedes abrir Drizzle Studio para ver y editar los datos de tu base de datos en una interfaz web:

    ```bash
    bun run db:studio
    ```

## Ejecución del Servidor

Para iniciar el servidor en modo de desarrollo (con recarga automática):

```bash
bun dev
```

El servidor estará escuchando en `http://localhost:3001`.

- **Health Check**: `http://localhost:3001/health`
- **WebSocket Feed**: `ws://localhost:3001/ws/feed`

## Comandos Disponibles

- `bun dev`: Inicia el servidor de desarrollo.
- `bun test`: Ejecuta los tests.
- `bun run db:generate`: Genera migraciones SQL basadas en el esquema.
- `bun run db:push`: Sincroniza el esquema con la base de datos.
- `bun run db:studio`: Abre Drizzle Studio.

## Tecnologías

- **Runtime**: Bun
- **Framework**: ElysiaJS
- **ORM**: Drizzle ORM
- **Base de Datos**: PostgreSQL
