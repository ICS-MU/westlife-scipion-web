from dependency_injector import providers, containers
from api.entities.deployment import DeploymentEntityFactory
from api.repositories.deployments import DeploymentsRepository, DeploymentsValidator
from api.repositories.templates import TemplatesRepository

class FactoriesContainer(containers.DeclarativeContainer):
    deployments_factory = providers.Singleton(DeploymentEntityFactory)

class RepositoriesContainer(containers.DeclarativeContainer):
    deployments_repository = providers.Singleton(DeploymentsRepository)
    templates_repository = providers.Singleton(TemplatesRepository)

class ValidatorsContainer(containers.DeclarativeContainer):
    deployments_validator = providers.Singleton(DeploymentsValidator)