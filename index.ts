import dotenv from 'dotenv';
import dataSource from "./config/db";
import {buildSchema} from 'type-graphql';
import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";

dotenv.config({path: `${__dirname}/.env`});

const start = async () => {
	try {
		await dataSource.initialize();
		console.log("Datasource has been initialized");

		const schema = await buildSchema({
			resolvers: []  // Make sure to include actual resolver classes
		});

		const server = new ApolloServer({schema});

		const {url} = await startStandaloneServer(server, {
			listen: {port: 4242}
		});

		console.log(`Server is ready at ${url}`);
	} catch (err) {
		console.error("Error during server setup: ", err);
	}
}

start();