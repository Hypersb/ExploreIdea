# Contributing to Explore Ida

Thank you for your interest in contributing to Explore Ida! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported
2. Use the bug report template
3. Provide detailed information:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)
   - Environment details

### Suggesting Features

1. Check if the feature has been suggested
2. Use the feature request template
3. Explain the use case and benefits
4. Provide examples or mockups if possible

### Pull Requests

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/exploreidea.git
   cd exploreidea
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests for new features
   - Update documentation

4. **Test Your Changes**
   ```bash
   # Backend tests
   cd backend
   pytest
   
   # Frontend tests
   cd frontend
   npm test
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   **Commit Message Format:**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

6. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub

## Development Guidelines

### Code Style

**Python (Backend)**
- Follow PEP 8
- Use type hints
- Write docstrings for functions
- Maximum line length: 100 characters

**JavaScript/React (Frontend)**
- Use ES6+ features
- Use functional components with hooks
- Follow Airbnb style guide
- Use meaningful variable names

### Testing

- Write unit tests for new features
- Maintain test coverage above 80%
- Test edge cases and error handling

### Documentation

- Update README.md for major changes
- Add inline comments for complex logic
- Update API documentation
- Include examples in documentation

## Project Structure

```
exploreidea/
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── routes/   # API endpoints
│   │   ├── services/ # Business logic
│   │   └── utils/    # Utility functions
│   └── tests/        # Backend tests
│
└── frontend/         # React frontend
    ├── src/
    │   ├── components/ # React components
    │   ├── pages/      # Page components
    │   ├── services/   # API services
    │   └── store/      # State management
    └── tests/          # Frontend tests
```

## Areas for Contribution

### High Priority
- [ ] User authentication system
- [ ] Advanced image filters
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Performance optimizations

### Medium Priority
- [ ] Image upload and search by image
- [ ] Social features (sharing, comments)
- [ ] Advanced analytics
- [ ] Voice search integration
- [ ] Browser extension

### Good First Issues
- [ ] UI improvements
- [ ] Documentation enhancements
- [ ] Test coverage improvements
- [ ] Bug fixes
- [ ] Code refactoring

## Getting Help

- Join our Discord/Slack community
- Ask questions in GitHub Discussions
- Tag maintainers in issues/PRs
- Check existing documentation

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in the project

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Explore Ida! 🎉
