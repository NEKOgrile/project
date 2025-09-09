# My Angular App

This project is an Angular application that connects to a Supabase database. It provides a user interface for users to input their credentials and connect to the database.

## Project Structure

```
my-angular-app
├── src
│   ├── app
│   │   ├── supabase
│   │   │   ├── supabase.service.ts      # Service for interacting with Supabase
│   │   │   └── connect-supabase
│   │   │       ├── connect-supabase.component.ts  # Component for connecting to Supabase
│   │   │       ├── connect-supabase.component.html # HTML template for the connection form
│   │   │       └── connect-supabase.component.scss  # Styles for the connection form
│   │   ├── app.module.ts                 # Main module of the application
│   │   └── app.component.ts              # Root component of the application
│   └── environments
│       ├── environment.ts                 # Development environment settings
│       └── environment.prod.ts            # Production environment settings
├── angular.json                           # Angular project configuration
├── package.json                           # npm configuration
├── tsconfig.json                          # TypeScript configuration
└── README.md                              # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd my-angular-app
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   ng serve
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:4200
   ```

## Usage

- Use the connection form provided in the `ConnectSupabaseComponent` to enter your Supabase credentials.
- The application will interact with the Supabase database using the methods defined in the `SupabaseService`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.