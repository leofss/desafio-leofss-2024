import { Habitat } from "./entity/Habitat.js";
import { RecintosZoo } from "./recintos-zoo.js";

describe("Recintos do Zoologico", () => {
  test("Deve rejeitar animal inválido", () => {
    const habitats = [
      new Habitat(1, ["Savana"], 10, ["MACACO", "MACACO", "MACACO"], 0),
      new Habitat(2, ["Floresta"], 5, [], 0),
      new Habitat(3, ["Savana", "Rio"], 7, ["GAZELA"], 0),
      new Habitat(4, ["Rio"], 8, [], 0),
      new Habitat(5, ["Savana"], 9, ["LEAO"], 0),
    ];
    const resultado = new RecintosZoo(habitats).analisaRecintos("UNICORNIO", 1);

    expect(resultado.erro).toBe("Animal inválido");
    expect(resultado.recintosViaveis).toBeFalsy();
  });

  test("Deve rejeitar quantidade inválida", () => {
    const habitats = [
      new Habitat(1, ["Savana"], 10, ["MACACO", "MACACO", "MACACO"], 0),
      new Habitat(2, ["Floresta"], 5, [], 0),
      new Habitat(3, ["Savana", "Rio"], 7, ["GAZELA"], 0),
      new Habitat(4, ["Rio"], 8, [], 0),
      new Habitat(5, ["Savana"], 9, ["LEAO"], 0),
    ];
    const resultado = new RecintosZoo(habitats).analisaRecintos("MACACO", 0);
    expect(resultado.erro).toBe("Quantidade inválida");
    expect(resultado.recintosViaveis).toBeFalsy();
  });

  test("Deve rejeitar a inserção de macaco em um habitat sózinho", () => {
    const habitats = [
      new Habitat(1, ["Savana"], 10, [], 10),
      new Habitat(2, ["Floresta"], 5, [], 5),
      new Habitat(3, ["Savana", "Rio"], 7, [], 7),
      new Habitat(4, ["Rio"], 8, ["CROCODILO"], 8),
      new Habitat(5, ["Savana"], 9, [], 9),
    ];
    const resultado = new RecintosZoo(habitats).analisaRecintos("MACACO", 1);
    expect(resultado.erro).toBe(
      "Um macaco não se sente confortável sem outro animal no recinto, seja da mesma ou outra espécie"
    );
    expect(resultado.recintosViaveis).toBeFalsy();
  });

  test("Deve recusar a inserção de animal carnívoro caso haja um animal de espécie diferente", () => {
    const habitats = [
      new Habitat(1, ["Savana"], 10, ["MACACO", "MACACO", "MACACO"], 0),
      new Habitat(2, ["Floresta"], 5, ["MACACO"], 0),
      new Habitat(3, ["Savana", "Rio"], 7, ["GAZELA"], 0),
      new Habitat(4, ["Rio"], 8, [], 0),
      new Habitat(5, ["Savana"], 9, ["LEAO"], 0),
    ];
    const resultado = new RecintosZoo(habitats).analisaRecintos("LEOPARDO", 1);
    expect(resultado.erro).toBe(
      "Animais carnívoros devem habitar somente com a própria espécie"
    );
    expect(resultado.recintosViaveis).toBeFalsy();
  });

  test("Deve recusar a inserção de animal não carnívoro caso haja um animal carnívoro no habitat", () => {
    const habitats = [
      new Habitat(1, ["Savana"], 10, ["LEAO", "LEAO"], 0),
      new Habitat(2, ["Floresta"], 5, ["MACACO"], 0),
      new Habitat(3, ["Savana", "Rio"], 7, ["LEAO", "LEAO"], 0),
      new Habitat(4, ["Rio"], 8, [], 0),
      new Habitat(5, ["Savana"], 9, ["LEAO", "LEAO", "LEAO"], 0),
    ];
    const resultado = new RecintosZoo(habitats).analisaRecintos("GAZELA", 1);
    expect(resultado.erro).toBe(
      "Animais já presentes no recinto devem continuar confortáveis com a inclusão do(s) novo(s)"
    );
    expect(resultado.recintosViaveis).toBeFalsy();
  });

  test("Deve recusar a inserção de hipopótamo caso o habitat tenha outra espécie e o habitat não é Savana e Rio", () => {
    const habitats = [
      new Habitat(
        1,
        ["Savana"],
        10,
        ["MACACO", "MACACO", "MACACO", "MACACO", "MACACO", "MACACO", "MACACO"],
        0
      ),
      new Habitat(2, ["Floresta"], 5, [], 0),
      new Habitat(3, ["Savana", "Rio"], 7, ["LEAO", "LEAO"], 0),
      new Habitat(4, ["Rio"], 8, ["CROCODILO", "CROCODILO"], 0),
      new Habitat(5, ["Savana"], 9, ["LEAO"], 0),
    ];
    const resultado = new RecintosZoo(habitats).analisaRecintos(
      "HIPOPOTAMO",
      1
    );
    expect(resultado.erro).toBe(
      "Hipopótamo(s) só tolera(m) outras espécies estando num recinto com savana e rio"
    );
    expect(resultado.recintosViaveis).toBeFalsy();
  });

  test("Não deve encontrar recintos para 10 macacos", () => {
    const habitats = [
      new Habitat(1, ["Savana"], 10, ["MACACO", "MACACO", "MACACO"], 0),
      new Habitat(2, ["Floresta"], 5, ["MACACO"], 0),
      new Habitat(3, ["Savana", "Rio"], 7, ["GAZELA"], 0),
      new Habitat(4, ["Rio"], 8, [], 0),
      new Habitat(5, ["Savana"], 9, ["LEAO"], 0),
    ];
    const resultado = new RecintosZoo(habitats).analisaRecintos("MACACO", 10);
    expect(resultado.erro).toBe("Não há recinto viável");
    expect(resultado.recintosViaveis).toBeFalsy();
  });

  test("Deve encontrar recinto para 1 crocodilo", () => {
    const habitats = [
      new Habitat(1, ["Savana"], 10, ["MACACO", "MACACO", "MACACO"], 0),
      new Habitat(2, ["Floresta"], 5, [], 0),
      new Habitat(3, ["Savana", "Rio"], 7, ["GAZELA"], 0),
      new Habitat(4, ["Rio"], 8, [], 0),
      new Habitat(5, ["Savana"], 9, ["LEAO"], 0),
    ];
    const resultado = new RecintosZoo(habitats).analisaRecintos("CROCODILO", 1);
    expect(resultado.erro).toBeFalsy();
    expect(resultado.recintosViaveis[0]).toBe(
      "Recinto 4 (espaço livre: 5 total: 8)"
    );
    expect(resultado.recintosViaveis.length).toBe(1);
  });

  test("Deve encontrar recintos para 2 macacos", () => {
    const habitats = [
      new Habitat(1, ["Savana"], 10, ["MACACO", "MACACO", "MACACO"], 0),
      new Habitat(2, ["Floresta"], 5, [], 0),
      new Habitat(3, ["Savana", "Rio"], 7, ["GAZELA"], 0),
      new Habitat(4, ["Rio"], 8, [], 0),
      new Habitat(5, ["Savana"], 9, ["LEAO"], 0),
    ];
    const resultado = new RecintosZoo(habitats).analisaRecintos("MACACO", 2);
    expect(resultado.erro).toBeFalsy();
    expect(resultado.recintosViaveis[0]).toBe(
      "Recinto 1 (espaço livre: 5 total: 10)"
    );
    expect(resultado.recintosViaveis[1]).toBe(
      "Recinto 2 (espaço livre: 3 total: 5)"
    );
    expect(resultado.recintosViaveis[2]).toBe(
      "Recinto 3 (espaço livre: 2 total: 7)"
    );
    expect(resultado.recintosViaveis.length).toBe(3);
  });
});
