import dataSource from "./config/db";
import app from './app'

const port = 4242;

const start = async () => {
	try {
		await dataSource.initialize();
		console.log("Datasource has been initialized");

		app.listen(port, '0.0.0.0', () => {
			console.log(`Backend server is listening on ${port}`);
		}).on('error', (err) => {
			console.log(err);
		});
	} catch (err) {
		console.error("Error during Datasource initialization", err);
	}
}

start();
