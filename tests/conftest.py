import pytest
from server.storage import IStorage, DatabaseStorage
from server.db import db
from shared.schema import repositories, githubInstallations

@pytest.fixture
async def storage() -> IStorage:
    """Provides a clean database for each test."""
    # Clear existing data
    await db.delete(repositories)
    await db.delete(githubInstallations)
    
    return DatabaseStorage()

@pytest.fixture
def mock_github_installation():
    """Provides mock GitHub installation data for testing."""
    return {
        "installationId": 12345,
        "accountName": "test-account"
    }

@pytest.fixture
def mock_repository():
    """Provides mock repository data for testing."""
    return {
        "url": "https://github.com/test/repo",
        "name": "test-repo",
        "installationId": 12345,
        "qualityScore": 85,
        "metrics": {
            "codeSmells": 5,
            "bugs": 2,
            "vulnerabilities": 1,
            "coverage": 75
        },
        "recommendations": [
            "Add more tests",
            "Fix identified bugs"
        ],
        "files": [
            {"name": "index.js", "path": "/", "type": "file"}
        ]
    }
