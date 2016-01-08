package demo
@Grab("spring-boot-starter-data-mongodb")
@Grab("spring-boot-starter-data-rest")

import org.springframework.data.repository.CrudRepository
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document

@SpringBootApplication
class ApplicationMongoDB {
}

@RestController
class ResourceConfigController {
	@RequestMapping("/toBeHidden")
	String[] toBeHidden() {
		["version"]
	}
}

@Document
class Person {
	@Id String id
	String firstName
	String lastName
	@Version Long version
	Person() {
	}
	Person(String firstName,String lastName) {
		this.firstName=firstName
		this.lastName=lastName
	}
}
@Document
class Item {
	@Id String id
	String name
	@Version Long version
	Item() {
	}
	Item(String name) {
		this.name=name
	}
}
interface PersonRepository extends CrudRepository<Person, String> {
}
interface ItemRepository extends CrudRepository<Item, String> {
}
