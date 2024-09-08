class HabitatService {
  constructor() {
    this.habitats = [];
    this.carnivorousAnimals = ["CROCODILO", "LEOPARDO", "LEAO"];
    this.animalSpaceUsage = {
      LEAO: 3,
      MACACO: 1,
      LEOPARDO: 2,
      CROCODILO: 3,
      GAZELA: 2,
      HIPOPOTAMO: 4,
    };
    this.animalHabitats = {
      LEAO: ["Savana"],
      LEOPARDO: ["Savana"],
      CROCODILO: ["Rio"],
      MACACO: ["Savana", "Floresta"],
      GAZELA: ["Savana"],
      HIPOPOTAMO: ["Savana", "Rio"],
    };
    this.validHabitatIds = [];
  }

  createHabitats(habitatArray) {
    this.habitats = habitatArray;
  }

  checkValidHabitats(animalToInsert, qtd) {
    this.validHabitatIds = [];

    const isValidAnimalName = this.isValidAnimalName(animalToInsert);
    if (!isValidAnimalName) {
      return this.returnResult("Animal inválido", false);
    }

    const isQtdValid = this.isQtdValid(qtd);
    if (!isQtdValid) {
      return this.returnResult("Quantidade inválida", false);
    }

    const isRemainingSpaceEnough = this.isRemainingSpaceEnough(
      animalToInsert,
      qtd
    );
    if (!isRemainingSpaceEnough) {
      return this.returnResult("Não há recinto viável", false);
    }

    if (animalToInsert == "HIPOPOTAMO") {
      const canIsertHippo = this.canInsertHippo(animalToInsert);
      if (!canIsertHippo) {
        return this.returnResult(
          "Hipopótamo(s) só tolera(m) outras espécies estando num recinto com savana e rio",
          false
        );
      }
    }

    if (animalToInsert == "MACACO") {
      const canInsertMontkey = this.canInsertMontkey(animalToInsert);
      if (!canInsertMontkey) {
        return this.returnResult(
          "Um macaco não se sente confortável sem outro animal no recinto, seja da mesma ou outra espécie",
          false
        );
      }
    }

    const checkIfAnimalIsCarnivorous =
      this.isAnimalCarnivorous(animalToInsert);
    if (checkIfAnimalIsCarnivorous) {
      const canInsertCarnivorousAnimal =  this.canInsertCarnivorousAnimal(animalToInsert)
      if (!canInsertCarnivorousAnimal) {
        return this.returnResult(
          "Animais carnívoros devem habitar somente com a própria espécie",
          false
        );
      }
    } else {
      const canInsertNotCarnivorous = this.canInsertNotCarnivorous();
      if (!canInsertNotCarnivorous) {
        return this.returnResult(
          "Animais já presentes no recinto devem continuar confortáveis com a inclusão do(s) novo(s)",
          false
        );
      }
    }

    this.minusOneIFMoreThenOneSpecies(animalToInsert);
    return this.returnValidHabitats();
  }

  calculateRemainingSpace() {
    const habitats = this.habitats;
    habitats.forEach((habitat) => {
      let occupiedSpace = 0;

      if (habitat.existingAnimals.length > 0) {
        habitat.existingAnimals.forEach((animal) => {
          const animalKey = animal.toUpperCase();
          if (this.animalSpaceUsage[animalKey]) {
            occupiedSpace += this.animalSpaceUsage[animalKey];
            habitat.remainingSpace = habitat.totalSize - occupiedSpace;
          }
        });
      } else {
        habitat.remainingSpace = habitat.totalSize;
      }
    });
  }

  isRemainingSpaceEnough(animalToInsert, qtd) {
    this.calculateRemainingSpace();
    const preferredHabitats =
      this.getPreferesHabitatsArrayByName(animalToInsert);
    const animalSpaceRequired = this.getAnimalSpaceUsage(animalToInsert);
    const totalSpaceRequired = animalSpaceRequired * qtd;
    const habitats = this.habitats;

    this.validHabitatIds = [];

    for (let i = 0; i < habitats.length; i++) {
      const currentBiome = habitats[i].biome;
      const flatCurrentBiome = currentBiome.flat();
      const flatPreferredHabitats = preferredHabitats.flat();
      const isPreferredHabitat = flatPreferredHabitats.some((preferred) =>
        flatCurrentBiome.includes(preferred)
      );

      if (isPreferredHabitat) {
        const remainingSpace = habitats[i].remainingSpace;
        if (remainingSpace >= totalSpaceRequired) {
          habitats[i].remainingSpace = remainingSpace - totalSpaceRequired;
          this.validHabitatIds.push(habitats[i].id);
        }
      }
    }

    return this.validHabitatIds.length > 0;
  }

  getAnimalSpaceUsage(animal) {
    const spaceUsage = this.animalSpaceUsage[animal];
    return spaceUsage;
  }

  getPreferesHabitatsArrayByName(animal) {
    const preferedHabitatsArray = this.animalHabitats;
    const prefered = [];
    const habitats = preferedHabitatsArray[animal];
    prefered.push(habitats);
    return prefered;
  }

  isAnimalCarnivorous(animalToInsert) {
    return this.carnivorousAnimals.includes(animalToInsert);
  }

  canInsertHippo() {
    const validHabitats = [];
    const requiredBiomes = ["Savana", "Rio"];

    for (let habitatId of this.validHabitatIds) {
      const habitat = this.habitats.find((hab) => hab.id === habitatId);

      if (habitat) {
        const hasValidBiome = requiredBiomes.some((biome) =>
          habitat.biome.includes(biome)
        );

        if (hasValidBiome) {
          const isHippoAlone = habitat.existingAnimals.length === 0;

          const hasOnlyHippo = habitat.existingAnimals.every(
            (animal) => animal === "HIPOPOTAMO"
          );
          if (isHippoAlone || hasOnlyHippo) {
            validHabitats.push(habitatId);
          } else {
            const hasSavanaAndRio = requiredBiomes.every((biome) =>
              habitat.biome.includes(biome)
            );

            if (hasSavanaAndRio) {
              validHabitats.push(habitatId);
            }
          }
        }
      }
    }

    this.validHabitatIds = validHabitats;
    return this.validHabitatIds.length > 0;
  }

  canInsertMontkey() {
    const validHabitats = [];
    for (let habitat of this.habitats) {
      if (habitat) {
        const isMonkeyAlone = habitat.existingAnimals.length === 0;
        if (isMonkeyAlone) {
          return false;
        } else {
          validHabitats.push(habitat.id);
          return true;
        }
      }
    }

    this.validHabitatIds = validHabitats;
    return this.validHabitatIds.length > 0;
  }

  canInsertCarnivorousAnimal(animalToInsert) {
    const validHabitatIds = [];
    if (this.carnivorousAnimals.includes(animalToInsert.toUpperCase())) {
      for (const habitatId of this.validHabitatIds) {
        const habitat = this.habitats.find((h) => h.id === habitatId);
        if (habitat) {
          if (habitat.existingAnimals.length === 0) {
            validHabitatIds.push(habitatId);
          } else {
            const hasOnlySameCarnivore = habitat.existingAnimals.every(
              (animal) => animal === animalToInsert.toUpperCase()
            );

            if (hasOnlySameCarnivore) {
              validHabitatIds.push(habitatId);
            }
          }
        }
      }
    }

    this.validHabitatIds = validHabitatIds;

    return this.validHabitatIds.length > 0;
  }

  canInsertNotCarnivorous() {
    const validHabitats = [];
    const carnivorousAnimals = ["CROCODILO", "LEOPARDO", "LEAO"];

    for (let habitatId of this.validHabitatIds) {
      const habitat = this.habitats.find((hab) => hab.id === habitatId);

      if (habitat) {
        const hasCarnivorousAnimal = habitat.existingAnimals.some((animal) =>
          carnivorousAnimals.includes(animal)
        );

        if (!hasCarnivorousAnimal) {
          validHabitats.push(habitatId);
        }
      }
    }

    this.validHabitatIds = validHabitats;

    return this.validHabitatIds.length > 0;
  }

  isValidAnimalName(animalName) {
    const validAnimalNames = [
      "LEAO",
      "LEOPARDO",
      "CROCODILO",
      "MACACO",
      "GAZELA",
      "HIPOPOTAMO",
    ];

    return validAnimalNames.includes(animalName);
  }

  isQtdValid(qtd) {
    if (qtd > 0) {
      return true;
    }
    return false;
  }

  minusOneIFMoreThenOneSpecies(animalToInsert) {
    for (let habitatId of this.validHabitatIds) {
      const habitat = this.habitats.find((h) => h.id === habitatId);

      if (habitat) {
        const hasDifferentAnimal = habitat.existingAnimals.some(
          (animal) => animal !== animalToInsert
        );
        if (hasDifferentAnimal) {
          habitat.remainingSpace -= 1;
        }
      }
    }
  }

  returnValidHabitats() {
    const recintosViaveisArray = [];

    for (let habitatId of this.validHabitatIds) {
      const habitat = this.habitats.find((hab) => hab.id === habitatId);

      if (habitat) {
        const habitatRemainingSpaces = habitat.remainingSpace;
        const habitatTotalSize = habitat.totalSize;

        const recintoMessage = `Recinto ${habitatId} (espaço livre: ${habitatRemainingSpaces} total: ${habitatTotalSize})`;

        recintosViaveisArray.push(recintoMessage);
      }
    }

    return this.returnResult(false, recintosViaveisArray);
  }

  returnResult(erro, recintosViaveis) {
    return {
      erro: erro,
      recintosViaveis: recintosViaveis,
    };
  }
}

export { HabitatService };
