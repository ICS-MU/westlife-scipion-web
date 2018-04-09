from dependency_injector import providers, containers
from api.entities.deployment import DeploymentEntityFactory
from api.entities.template import TemplateEntityFactory
from api.repositories.deployments import DeploymentsRepository, DeploymentsValidator
from api.repositories.templates import TemplatesRepository

class FactoriesContainer(containers.DeclarativeContainer):
    deployments_factory = providers.Singleton(DeploymentEntityFactory)
    templates_factory = providers.Singleton(TemplateEntityFactory)

class RepositoriesContainer(containers.DeclarativeContainer):
    deployments_repository = providers.Singleton(DeploymentsRepository, factory=FactoriesContainer.deployments_factory())
    templates_repository = providers.Singleton(TemplatesRepository, factory=FactoriesContainer.templates_factory())

class ValidatorsContainer(containers.DeclarativeContainer):
    deployments_validator = providers.Singleton(DeploymentsValidator)