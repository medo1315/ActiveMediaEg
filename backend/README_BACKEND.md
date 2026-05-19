# Active Media - .NET 8 Web API Backend

This is the new .NET 8 Web API & SQL Server backend designed to replace Supabase for the Active Media web application.

## 🚀 Features
- **Architecture**: Modern ASP.NET Core Web API (.NET 8).
- **Database**: Entity Framework Core with SQL Server. Eager loading, automatic conversions for collections, and robust cascade delete strategies.
- **Authentication**: JWT Bearer Tokens with secure SHA256 password hashing.
- **Auto-Migration & Seeding**: Automatic database migration on startup (`context.Database.Migrate()`) with premium sample projects, clients, and settings.
- **Swagger UI**: Built-in interactive documentation and JWT authorization testing.
- **CORS**: Configured to seamlessly accept requests from the React/Vite frontend.

## 📦 How to Create and Run Database Migrations

Before running the application for the first time, generate the initial migration to build your SQL Server schema:

1. Open your terminal or PowerShell and navigate to the backend API directory:
   ```powershell
   cd d:\Active-Media-main\backend\ActiveMedia.Api
   ```
2. (Optional) If you don't have the EF Core tools installed globally, install them:
   ```powershell
   dotnet tool install --global dotnet-ef
   ```
3. Generate the initial migration:
   ```powershell
   dotnet ef migrations add InitialCreate
   ```
4. Apply the migration to SQL Server:
   ```powershell
   dotnet ef database update
   ```
   *(Note: The app is also configured with `context.Database.Migrate()` in `Program.cs`, so whenever you run `dotnet run`, any pending migrations will be applied automatically!)*

## 🛠️ How to Run

1. Open a terminal or PowerShell in this directory (`backend/ActiveMedia.Api`).
2. Run the application using the .NET CLI:
   ```powershell
   dotnet run
   ```
3. The API will start on `http://localhost:5000` (or your configured launch URL).
4. Open your browser and navigate to the Swagger UI to inspect and test the endpoints:
   ```
   http://localhost:5000/swagger
   ```

## 🔑 Authentication Credentials
To test endpoints that require authorization or to log into the admin panel, use the following default credentials seeded in the database:
- **Email**: `admin@activemedia.com`
- **Password**: `admin123`

## 🗄️ Database Configuration
The connection string is located in `appsettings.json`:
```json
"DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=ACTIVEMEDIA;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true;"
```
By default, it connects to your LocalDB SQL Server instance (`Server=(localdb)\MSSQLLocalDB`).
