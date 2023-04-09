import graphene
from graphene_django import DjangoObjectType
from .models import Todo, Action
from users.schema import UserType
from django.db.models import Q
from graphql_jwt.decorators import login_required

"""
This is a Python code for a GraphQL API that allows you to perform CRUD operations on a Todo model. It uses Django, graphene, and graphene-django libraries.

The code defines three GraphQL object types:

TodoType: a Graphql object type that converts python database Model[Todo] to GraphQL object type.
ActionType: a Graphql object type that converts python database Model[Action] to GraphQL object type.
UserType: a Graphql object type that converts python database Model[User] to GraphQL object type.
The Query class defines two queries:

todos: a query that returns a list of Todo objects.
actions: a query that returns a list of Action objects.
The Mutation class defines four mutations:

create_todo: a mutation that allows you to create a new Todo object.
update_todo: a mutation that allows you to update an existing Todo object.
delete_todo: a mutation that allows you to delete an existing Todo object.
action_todo: a mutation that allows you to add a Todo object to the user's action list.
The code also defines four mutation methods:

mutate: a method that creates a new Todo object.
mutate: a method that updates an existing Todo object.
mutate: a method that deletes an existing Todo object.
mutate: a method that adds a Todo object to the user's action list.
The @login_required decorator has been added to each mutation method to ensure that only authenticated users can perform CRUD operations.

The code also uses Django's Q object to implement a search feature for the todos query. The search parameter takes a string and returns a list of Todo objects that match the string in their title, description, or the username of the user who posted them.

In conclusion, this Python code provides a GraphQL API that allows you to perform CRUD operations on a Todo model using Django, graphene, and graphene-django libraries. It also provides a search feature for the todos query and ensures that only authenticated users can perform CRUD operations
"""

# Define a GraphQL Object Type for the Todo model using DjangoObjectType
class TodoType(DjangoObjectType):
    """
    The TodoType class defines a GraphQL Object Type for the Todo model, which is used to convert the Python Todo model 
    to a GraphQL Object Type. This allows us to easily query for Todo objects using GraphQL.
    """

    class Meta:
        model = Todo

# Define a GraphQL Object Type for the Action model using DjangoObjectType
class ActionType(DjangoObjectType):
    """
    The ActionType class defines a GraphQL Object Type for the Action model, which is used to convert the Python Action model 
    to a GraphQL Object Type. This allows us to easily query for Action objects using GraphQL.
    """

    class Meta:
        model = Action

# Define a Query class for GraphQL queries
class Query(graphene.ObjectType):
    """
    The Query class defines the GraphQL queries that we can make to our application. We can query for a list of todos 
    and actions. We can also pass a search string to filter todos based on a keyword search.
    """
    # Define the GraphQL query parameters
    todos = graphene.List(TodoType, search=graphene.String())
    actions = graphene.List(ActionType)

    # Define a resolver for the todos query parameter
    def resolve_todos(self, info, search=None):
        """
        The resolve_todos method is used to resolve the 'todos' query. We can pass a search string as a parameter to 
        filter todos based on a keyword search. If a search string is provided, it will filter todos based on title, 
        description, and the username of the user who posted the todo. If no search string is provided, it will return 
        all todos in the database.
        """
        if search:
            filter = (Q(title__icontains=search)
                      | Q(description__icontains=search)
                      | Q(posted_by__username__icontains=search))
            return Todo.objects.filter(filter)
        return Todo.objects.all()

    def resolve_actions(self, info):
        """
        This method returns all the actions as list those belongs to the Todo model.
        """
        return Action.objects.all()

class CreateTodo(graphene.Mutation):
    """
    This CreateTodo class defines a Graphql mutation that allows to create a new todo object.
    """
    # Define the mutation's return type
    todo = graphene.Field(TodoType)

    class Arguments:
        """
        This Arguments class defines the input arguments that the mutation can take, namely title and description.
        """
        title = graphene.String()
        description = graphene.String()

    @login_required
    def mutate(self, info, **kwargs):
        """
        This mutate method defines the logic for the create todo mutation. It creates a new Todo object with the provided title 
        and description, and associates it with the authenticated user.
        """
        user = info.context.user
        todo = Todo(title=kwargs.get('title'),
                    description=kwargs.get('description'),
                    posted_by=user,
                    some_number=5)
        todo.save()

        # Return the created todo object as part of the mutation's response
        return CreateTodo(todo=todo)


class UpdateTodo(graphene.Mutation):
    """
    This UpdateTodo class defines a Graphql mutation that allows to update an existing todo object.
    """
    # Define the mutation's return type
    todo = graphene.Field(TodoType)

    class Arguments:
        """
        This Arguments class defines the input arguments that the mutation can take, namely the ID of the todo object to update, 
        as well as the new title and description.
        """
        todo_id = graphene.Int()
        title = graphene.String()
        description = graphene.String()

    @login_required
    def mutate(self, info, **kwargs):
        """
        This mutate method defines the logic for the update todo mutation. It fetches the specified Todo object from the database, 
        updates its title and description with the provided values, and saves the changes. It also associates the updated todo 
        with the authenticated user.
        """
        user = info.context.user
        todo = Todo.objects.get(id=kwargs.get('todo_id'))
        todo.title = kwargs.get('title')
        todo.description = kwargs.get('description')
        todo.some_number = 10

        todo.save()

        # Return the updated todo object as part of the mutation's response
        return UpdateTodo(todo=todo)

class DeleteTodo(graphene.Mutation):
    """
    A GraphQL mutation to delete a todo from the database.
    """

    # Output field
    todo_id = graphene.Int()

    class Arguments:
        """
        Input arguments for the 'DeleteTodo' mutation.
        """
        todo_id = graphene.Int(required=True)

    @login_required
    def mutate(self, info, **kwargs):
        """
        Deletes a todo record from the database. Authentication required.

        Args:
            info: GraphQL Resolve Info object.
            kwargs: Arguments passed to the mutation.

        Returns:
            A DeleteTodo object with the ID of the deleted todo.
        """
        user = info.context.user
        todo_id = kwargs.get('todo_id')
        todo = Todo.objects.get(id=todo_id)
        todo.delete()
        return DeleteTodo(todo_id=todo_id)


class CreateActionTodo(graphene.Mutation):
    """
    A GraphQL mutation to add a todo to a user's action list.
    """

    # Output fields
    user = graphene.Field(UserType)
    todo = graphene.Field(TodoType)

    class Arguments:
        """
        Input arguments for the 'CreateActionTodo' mutation.
        """
        todo_id = graphene.Int()

    @login_required
    def mutate(self, info, **kwargs):
        """
        Adds a todo to the user's action list. Authentication required.

        Args:
            info: GraphQL Resolve Info object.
            kwargs: Arguments passed to the mutation.

        Returns:
            A CreateActionTodo object with the user and todo fields.
        """
        user = info.context.user
        todo_id = kwargs.get("todo_id")
        todo = Todo.objects.get(id=todo_id)

        Action.objects.create(user=user, todo=todo)
        return CreateActionTodo(user=user, todo=todo)


class Mutation(graphene.ObjectType):
    """
    A GraphQL object type for todo CRUD operations.
    """

    # Mutations
    create_todo = CreateTodo.Field()
    update_todo = UpdateTodo.Field()
    delete_todo = DeleteTodo.Field()
    action_todo = CreateActionTodo.Field()