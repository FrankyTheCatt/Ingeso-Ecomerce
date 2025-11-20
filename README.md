# 🛒 Taller de Ingeniería de Software - Noporolos Store


![Estado del Proyecto](https://img.shields.io/badge/Estado-Terminado-success)
![Licencia](https://img.shields.io/badge/Licencia-MIT-blue)

**Noporolos Store** es una plataforma de comercio electrónico completa y funcional desarrollada para la asignatura de Taller de Ingeniería de Software. El sistema permite la gestión y venta de útiles escolares y artículos universitarios, contando con paneles dedicados para clientes y administradores.

---

## 📋 Tabla de Contenidos

1. [Características](#-características)
2. [Stack Tecnológico](#-stack-tecnológico)
3. [Arquitectura y Estructura](#-arquitectura)
4. [Instalación y Configuración](#-instalación-y-configuración)
5. [Variables de Entorno](#-variables-de-entorno)
6. [Autores](#-autores)

---

## ✨ Características

### 👤 Para Clientes
* **Catálogo Interactivo:** Visualización de productos con filtrado por categorías.
* **Carrito de Compras:** Gestión de productos en tiempo real (añadir, eliminar, modificar cantidades) persistente localmente.
* **Proceso de Checkout:**
    * Gestión de direcciones de envío (guardar, eliminar y seleccionar predeterminadas).
    * Soporte para múltiples métodos de pago (Efectivo, Transferencia).
* **Autenticación Segura:** Registro e inicio de sesión de usuarios.
* **Historial:** Visualización del estado y detalle de compras anteriores.

### 🛡️ Para Administradores
* **Dashboard Analítico:**
    * Gráficos interactivos de ventas (Recharts).
    * Métricas de ingresos totales, stock bajo y productos más vendidos.
    * Desglose de ventas por categoría.
* **Gestión de Inventario:** CRUD completo de productos (Crear, Leer, Actualizar, Eliminar).
* **Carga de Imágenes:** Subida de imágenes de productos integradas.
* **Control de Ventas:** Listado detallado de todas las transacciones realizadas.

---

## 💻 Stack Tecnológico

El proyecto utiliza una arquitectura moderna basada en **Next.js 15** con **App Router**.

### Frontend & UI
* **Framework:** [Next.js](https://nextjs.org/) (React 19)
* **Lenguaje:** TypeScript
* **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/) (Basado en Radix UI)
* **Iconos:** Lucide React
* **Gráficos:** Recharts
* **Notificaciones:** Sonner

### Backend & Datos
* **BaaS:** [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)
* **ORM/Cliente:** Supabase SSR & JS Client
* **Validación de Formularios:** React Hook Form + Zod

### Utilidades
* **Manejo de Fechas:** date-fns
* **Gestión de Paquetes:** PNPM

---

## 🛠️ Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

1.  **Clonar el repositorio:**
    ```bash
    git clone [URL-DE-TU-REPOSITORIO]
    cd ingeso-ecomerce
    ```

2.  **Instalar dependencias:**
    Este proyecto utiliza `pnpm` para una gestión eficiente de paquetes.
    ```bash
    pnpm install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env.local` en la raíz del proyecto basándote en los requisitos de Supabase.

4.  **Ejecutar el servidor de desarrollo:**
    ```bash
    pnpm dev
    ```
    Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🔑 Variables de Entorno

Para que la aplicación funcione correctamente, necesitas configurar las siguientes variables en tu archivo `.env.local`. Puedes obtener estas credenciales en el panel de configuración de tu proyecto en Supabase.

```env
# URL de tu proyecto Supabase (Settings > API)
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase

# Llave anónima pública (Settings > API)
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase

# URL de redirección para autenticación (opcional en local)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/my-orders

## 👥 Autores

* Nicolas Galleguillos
* Vicente Ruiz
* Abraham Sepúlveda
