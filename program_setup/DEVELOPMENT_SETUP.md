# Development Environment Setup

This guide helps you set up your development environment for contributing to CampusGo.

## Prerequisites

### System Requirements
- **OS**: Windows, macOS, or Linux
- **Node.js**: 18+ LTS (download from [nodejs.org](https://nodejs.org))
- **Python**: 3.10+ (download from [python.org](https://python.org))
- **Git**: Latest version
- **Code Editor**: VS Code recommended

### Verify Installations
```bash
node --version  # Should be v18+
npm --version   # Should be 9+
python --version  # Should be 3.10+
git --version
```

## IDE Setup (VS Code)

### Recommended Extensions
1. **ESLint** - `dbaeumer.vscode-eslint`
2. **Prettier** - `esbenp.prettier-vscode`
3. **TypeScript Vue Plugin** - `Vue.volar`
4. **Tailwind CSS IntelliSense** - `bradlc.vscode-tailwindcss`
5. **Python** - `ms-python.python`
6. **Django** - `batisteo.vscode-django`

### Settings (`settings.json`)
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[python]": {
    "editor.defaultFormatter": "ms-python.python",
    "editor.formatOnSave": true
  },
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true
}
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd project
npm install
```

### 2. Create Environment File
```bash
echo "VITE_API_URL=http://localhost:8000" > .env
```

### 3. Verify Installation
```bash
npm run typecheck  # Should have no errors
npm run lint       # Should have no errors
```

### 4. Start Dev Server
```bash
npm run dev
```

Frontend will be at: `http://localhost:5173`

## Backend Setup

### 1. Create Virtual Environment
```bash
cd project
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirment.txt
```

### 3. Run Migrations
```bash
python manage.py migrate
```

### 4. Create Superuser
```bash
python manage.py createsuperuser
# Follow prompts to create admin account
```

### 5. Start Dev Server
```bash
python manage.py runserver
```

Backend will be at: `http://localhost:8000`

## Development Workflow

### Making Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes** in the relevant file

3. **Test locally**:
   ```bash
   # Frontend
   npm run lint
   npm run typecheck
   npm run dev

   # Backend
   python manage.py test
   python manage.py runserver
   ```

4. **Commit with clear messages**:
   ```bash
   git add .
   git commit -m "feat: add route management system"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feat/your-feature-name
   ```

6. **Open a Pull Request** on GitHub

### Code Style Guidelines

#### Frontend (TypeScript/React)
- Use functional components with hooks
- Use meaningful variable names
- Add JSDoc comments for complex functions
- Keep components under 300 lines
- Use Tailwind CSS for styling

Example:
```typescript
/**
 * Displays shuttle information card
 * @param shuttle - Shuttle data
 * @returns React component
 */
const ShuttleCard: React.FC<{ shuttle: Shuttle }> = ({ shuttle }) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3>{shuttle.id}</h3>
      {shuttle.nextRoute && (
        <p>{shuttle.nextRoute.origin} → {shuttle.nextRoute.destination}</p>
      )}
    </div>
  );
};
```

#### Backend (Python/Django)
- Follow PEP 8 style guide
- Use meaningful variable names
- Add docstrings to functions and classes
- Use type hints where possible

Example:
```python
def get_next_route(self) -> Optional['Route']:
    """
    Get the next route for this vehicle.
    
    Returns:
        Route object or None if no more routes
    """
    if self.current_route_index < len(self.routes.all()):
        return self.routes.all()[self.current_route_index]
    return None
```

## Common Development Tasks

### Add a New API Endpoint

1. **Define in models** (`backend_api/models.py`)
2. **Create serializer** (`backend_api/serializer.py`)
3. **Add view** (`backend_api/views.py`)
4. **Register URL** (`backend_api/urls.py`)
5. **Add to apiService** (`src/services/apiService.ts`)
6. **Test with API** (use postman or test-api.js)

### Add a New Frontend Component

1. Create file in `src/components/`
2. Use TypeScript and functional components
3. Add Tailwind CSS classes
4. Export from component index
5. Import and use in pages

### Run Tests

```bash
# Frontend (if tests exist)
npm run test

# Backend
python manage.py test

# API Integration Tests
npm run test:api
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 5173 (frontend) or 8000 (backend)
lsof -i :5173  # macOS/Linux
netstat -ano | findstr :5173  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Virtual Environment Issues
```bash
# Deactivate and reactivate
deactivate
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirment.txt
```

### Node Modules Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database Issues
```bash
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

## Before Opening a PR

- [ ] Run `npm run lint` and fix issues
- [ ] Run `npm run typecheck` and fix issues
- [ ] Run backend tests
- [ ] Test the feature manually
- [ ] Update documentation if needed
- [ ] Write clear commit messages
- [ ] Include issue reference if applicable

## Getting Help

- Check existing issues for similar problems
- Read the main [SETUP.md](./SETUP.md)
- Ask questions in discussions or issues
- Reach out to maintainers

---

**Last Updated**: November 2025
