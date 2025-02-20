import pytest
from server.storage import DatabaseStorage
from shared.schema import type Repository, type GithubInstallation

def test_create_github_installation(storage, mock_github_installation):
    """Test creating a GitHub installation."""
    installation = storage.createGithubInstallation(mock_github_installation)
    assert installation.installationId == mock_github_installation["installationId"]
    assert installation.accountName == mock_github_installation["accountName"]

def test_get_github_installation(storage, mock_github_installation):
    """Test retrieving a GitHub installation."""
    created = storage.createGithubInstallation(mock_github_installation)
    retrieved = storage.getGithubInstallation(created.installationId)
    assert retrieved is not None
    assert retrieved.id == created.id

def test_create_repository(storage, mock_repository):
    """Test creating a repository."""
    repository = storage.createRepository(mock_repository)
    assert repository.url == mock_repository["url"]
    assert repository.name == mock_repository["name"]
    assert repository.qualityScore == mock_repository["qualityScore"]

def test_get_repository(storage, mock_repository):
    """Test retrieving a repository."""
    created = storage.createRepository(mock_repository)
    retrieved = storage.getRepository(created.id)
    assert retrieved is not None
    assert retrieved.id == created.id
    assert retrieved.url == mock_repository["url"]
