from dependency_injector import providers, containers
from api.entities.deployment import DeploymentEntityFactory
from api.repositories.deployments import DeploymentsRepository, DeploymentsValidator

class FactoriesContainer(containers.DeclarativeContainer):
    deployments_factory = providers.Singleton(DeploymentEntityFactory)

class RepositoriesContainer(containers.DeclarativeContainer):
    deployments_repository = providers.Singleton(DeploymentsRepository, factory=FactoriesContainer.deployments_factory())

class ValidatorsContainer(containers.DeclarativeContainer):
    deployments_validator = providers.Singleton(DeploymentsValidator)