# 🛒 Taller de Ingeniería de Software - Los Noporolo

Este proyecto es un e-commerce funcional desarrollado para la universidad, enfocado en la venta de útiles escolares y artículos necesarios para la vida estudiantil.

## ✨ Características Principales

La plataforma cuenta con las siguientes funcionalidades:

* **Autenticación de Usuarios:** Sistema completo de registro (`Crear Usuario`) e inicio de sesión (`Iniciar Sesión`).
* **Gestión de Roles:**
    * **Usuario:** Rol asignado automáticamente al registrarse. Puede comprar y ver su historial.
    * **Administrador:** Tiene acceso a un panel de control para gestionar la tienda.
* **Panel de Administración:**
    * Agregar y editar productos.
    * Gestionar el inventario.
    * Visualizar ingresos y métricas de ventas.
* **Carrito de Compras:** Funcionalidad para agregar, modificar y eliminar productos del carrito.
* **Proceso de Pago:** Soporte para dos métodos de pago: **Efectivo** y **Transferencia Bancaria**.
* **Historial de Compras:** Los usuarios pueden consultar un registro de todos sus pedidos anteriores.
* **Catálogo:** Homepage con vista de productos y componentes de React.

## 💻 Tecnologías Utilizadas

Este proyecto fue construido utilizando un stack moderno basado en TypeScript:

* **Framework:** [Next.js](https://nextjs.org/) (usando App Router)
* **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
* **Backend y Base de Datos:** [Supabase](https://supabase.com/)
* **UI:** [React](https://reactjs.org/)
* **Manejo de Estado:** React Context API (para el carrito de compras)
* **Estilos:** [PostCSS](https://postcss.org/) (Probablemente junto a [Tailwind CSS](https://tailwindcss.com/))
* **Manejador de Paquetes:** [PNPM](https://pnpm.io/)

## 🚀 Instalación y Puesta en Marcha

Sigue estos pasos para correr el proyecto en tu máquina local:

1.  **Clonar el repositorio:**
    ```bash
    git clone [URL-DE-TU-REPOSITORIO-AQUÍ]
    cd [NOMBRE-DE-LA-CARPETA-DEL-PROYECTO]
    ```

2.  **Instalar dependencias:**
    Se recomienda usar `pnpm` como manejador de paquetes.
    ```bash
    pnpm install
    ```


3.  **Correr el proyecto (Desarrollo):**
    ```bash
    pnpm dev
    ```
    Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

4.  **Correr el proyecto (Producción):**
    Para simular el entorno de producción:
    ```bash
    # 1. Construir la aplicación
    pnpm run build

    # 2. Iniciar el servidor
    pnpm start
    ```

## 👥 Autores

* Nicolas Galleguillos
* Vicente Ruiz
* Abraham Sepúlveda
