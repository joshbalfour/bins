import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { getSchema } from "@joshbalfour/bins-graphql-schema";

const go = async () => {
  const schema = await getSchema();
  const server = new ApolloServer({
    schema,
    formatError: (error) => {
      console.error(JSON.stringify(error, null, 2));
      return error;
    },
  });
  startStandaloneServer(server, {
    listen: { port: process.env.PORT || 4010 },
  }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

go().catch(console.error);
