import { HabitatService } from "./service/HabitatService.js";

class RecintosZoo {
  constructor(habitats) {
    this.habitatService = new HabitatService();
    this.habitats = habitats;
  }

  analisaRecintos(animal, quantidade) {
    this.habitatService.createHabitats(this.habitats);
    return this.habitatService.checkValidHabitats(animal, quantidade);
  }
}

export { RecintosZoo as RecintosZoo };
