import graphene
import todo.schema
import users.schema
import graphql_jwt

class Query(users.schema.QueryUser,todo.schema.Query, graphene.ObjectType):
    """
    This Query class allows you fetch informations related to Todo objects from the database.
    """
    pass

class Mutation(users.schema.Mutation ,todo.schema.Mutation, graphene.ObjectType):
    """
    This Mutation class allows you to create user,todo objects. Also it facilates you update,delete the objects as needed. It also takes care of
    the user authentication process. It logins a user and returns a unique JsonWebToken for further authentications.
    """
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

# registering Quey and Muation to the graphql schema.
schema = graphene.Schema(query=Query, mutation=Mutation)