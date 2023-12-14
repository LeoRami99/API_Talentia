import { Request, Response } from "express";

class CategoriasController {
	getCategorias = async (req: Request, res: Response) => {
		try {
			// lista de categorias
			const categorias_array = [
				"Javascript",
				"Python",
				"Java",
				"C#",
				"C++",
				"PHP",
				"Ruby",
				"Rust",
				"Go",
				"Swift",
				"Kotlin",
				"Typescript",
				"C",
				"Objective-C",
				"Scala",
				"Perl",
				"R",
				"Visual Basic",
				"Dart",
				"Lua",
				"Haskell",
				"Clojure",
				"Groovy",
				"Elixir",
				"Julia",
				"Erlang",
				"F#",
				"Racket",
				"Scheme",
				"COBOL",
				"Fortran",
				"Ada",
				"Lisp",
				"Prolog",
				"Delphi",
				"Pascal",
				"Assembly",
				"SQL",
				"PL/SQL",
				"T-SQL",
				"NoSQL",
				"MongoDB",
				"Cassandra",
				"Redis",
				"Firebase",
				"PostgreSQL",
				"MySQL",
				"MariaDB",
				"Oracle",
				"SQLite",
				"Microsoft SQL Server",
				"DynamoDB",
				"Neo4j",
				"ArangoDB",
				"CouchDB",
				"HBase",
				"Riak",
				"Couchbase",
				"Memcached",
				"Elasticsearch",
				"Solr",
				"Apache Lucene",
				"Apache Solr",
				"Apache Kafka",
				"Apache Spark",
				"Apache Hadoop",
				"Apache Hive",
				"Apache Flink",
				"Apache Storm",
				"Apache Beam",
				"Apache Apex",
				"Apache Samza",
				"Apache Kylin",
				"Apache Tajo",
				"Apache Giraph",
				"Apache Ignite",
				"Apache CouchDB",
				"Apache Drill",
				"Apache Phoenix",
				"Apache Calcite",
				"Apache Kudu",
				"Apache Ranger",
				"Apache Oozie",
				"Apache Sqoop",
				"Apache Flume",
				"Apache Airflow",
				"Apache NiFi",
				"Apache Zeppelin",
				"Apache Superset",
				"Apache Atlas",
				"Apache Ambari",
				"Apache ZooKeeper",
				"Apache HBase",
				"Apache Phoenix",
				"Apache Accumulo",
				"Apache Sentry",
				"Apache Metron",
				"Apache Ranger",
				"Apache Knox",
				"Apache Helix",
				"Apache Nutch",
				"Apache Whirr",
				"Apache Trafodion",
				"Apache Twill",
				"Apache Myriad",
				"Apache MRQL",
				"Apache Lens",
				"Apache Chukwa",
				"Apache Sirona",
				"Apache Eagle",
				"Apache MetaModel",
				"Apache DataFu",
				"Apache Eagle",
				"Apache MetaModel",
				"Apache DataFu",
				"Apache Eagle",
				"Apache MetaModel",
			];
			// respuesta
			res.status(200).json({
				categorias: categorias_array,
			});
		} catch (error) {
			return res.status(500).json({
				error: "Error en el servidor",
			});
		}
	};
	getNiveles = async (req: Request, res: Response) => {
		try {
			const niveles_array = ["Básico", "Intermedio", "Avanzado"];
			res.status(200).json({
				niveles: niveles_array,
			});
		} catch (error) {
			return res.status(500).json({
				error: "Error en el servidor",
			});
		}
	};
}

export default CategoriasController;
