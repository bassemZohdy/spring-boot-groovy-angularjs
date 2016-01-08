package demo
@Grab("h2")
@Grab("spring-boot-starter-data-jpa")
@Grab("spring-boot-starter-data-rest")

import javax.persistence.*
import org.springframework.data.repository.CrudRepository
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.orm.jpa.EntityScan

@SpringBootApplication
@EntityScan
class ApplicationJpa {
}

@RestController
class ResourceConfigController {
  @RequestMapping("/toBeHidden")
  String[] toBeHidden() {
    ["version"]
  }
}

@Entity
class Person {
  @Id
  @GeneratedValue(strategy=GenerationType.AUTO)
  long id
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

@Entity
class Item {
  @Id
  @GeneratedValue(strategy=GenerationType.AUTO)
  long id
  String name
  @Version Long version
  Item() {
  }
  Item(String name) {
    this.name=name
  }
}
interface PersonRepository extends CrudRepository<Person, Long> {
}
interface ItemRepository extends CrudRepository<Item, Long> {
}
