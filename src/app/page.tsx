"use client";
import { Form } from "../components/Form";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { z } from "zod";
// Essa lib também consegue trabalhar com yup e joi, duas libs concorrentes do zod
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

/*

A aprender:

- Validação / transformação
- Upload de arquivos
- Composition Pattern
- Field Arrays

Se informar sobre:

- Controlled e unControlled components
  Básicamente pelo pouco que foi dito os unControlleds evitam renderização, pois não monitoram cada alteração de estado
  dentro do input, apenas quando ele é enviado

*/
export default function Home() {
  const axios = require("axios").default;
  // Schema é a representação de uma estrutura de dados
  const createUserFormSchema = z.object({
    avatar: z.instanceof(FileList).transform((list) => list.item(0)),
    // Aqui no nome a trnasformação é mais complexa, então fica até meio complicado de compreender perfeitamente tudo que
    // é feito, mas o objetivo é capitalizar o nome, então primeiro é feito uso do transform por motivos óbvios, depois o
    // método trim para retirar qualquer espaço à esquerda ou a direita, em seguida o método split para separar as palavras
    // depois o método map para encontrar a primeira letra de cada palavra, passá-la para upperCase com o localeUpperCase
    // e em seguida usar o concat com a palavra e o substring(1) para reposicionar essa letra com o restante da string a partir
    // do segundo caractére. Por fim um join é utilizado para rejuntar as palavras
    name: z
      .string()
      .min(1, "O nome é obrigatório")
      .transform((name) => {
        return name
          .trim()
          .split(" ")
          .map((word) => {
            return word[0].toLocaleUpperCase().concat(word.substring(1));
          })
          .join(" ");
      }),

    // É sempre importante lembrar que o zod não só valida dados como também pode transforma-los, conforme o exemplo abaixo
    // onde todas as letras digitadas no input passarão a ser minúsculas.
    // Além disso, é possível validar dados de formas refinadas como utilizando o refine() ou o superRefine(), a diferença
    // entre ambos é que o superRefine() pega todos os campos enquanto o refine apenas o que está sendo manipulado
    email: z
      .string()
      .min(1, "O email é obrigatório")
      .email("Formato de e-mail inválido")
      .toLowerCase()
      .refine((email) => email.includes("gab"), "O email não inclui gab."),
    password: z.string().min(6, "A senha precisa de no mínimo 6 caractéres."),
    techs: z
      .array(
        z.object({
          title: z.string().min(1, "O título é obrigatório"),
          knowLedge: z.coerce.number().min(1).max(100),
        })
      )
      .min(2, "Insira pelo menos duas tecnologias."),
  });

  const createUserForm = useForm<CreateUserFormData>({
    //Esse resolver serve para o formulário "compreender" os campos esperados!
    resolver: zodResolver(createUserFormSchema),
  });

  // Infer é básicamente uma forma de definir de forma automática
  type CreateUserFormData = z.infer<typeof createUserFormSchema>;

  // Dois itens muito importantes vindos do useForm são o register e o handleSubmit, o register serve como uma forma de mapeamento
  // do formulário, já o handleSubmit é basicamente a função de envio, que serve como forma de chamar uma outra função, o que em js
  // chamamos de High-order function
  // Aqui ainda foi realizada uma dupla desestruturação
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = createUserForm;

  // Aqui se subentende, fields append e remove como os campos em si, a adição e a remoção respectivamente!
  const { fields, append, remove } = useFieldArray({
    control,
    name: "techs",
  });
  const [output, setOutput] = useState("");

  // Após ser feito o primeiro erro as mensagens de erro se atualizam em tempo real pois o react-hook-form entra em modo
  // watch, é possível configurar para esse monitoramento estar sempre ativo, mas geralmente não é usado
  console.log(errors);

  async function createUser(data: CreateUserFormData) {
    let formData = new FormData();
    formData.append("file", data.avatar!);
    formData.append(
      "user",
      JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      })
    );
    console.log(data.avatar);
    await axios.post("http://localhost:9999/user/file", formData);
    setOutput(JSON.stringify(data, null, 2));
  }

  // Essa função utiliza o append pegado na desestruturação do useFieldArray para adicionar um novo campo ao formulário
  function addNewTech() {
    append({
      title: "",
      knowLedge: 0,
    });
  }

  // Comentário a respeito dos ComponentProps que estou sempre passando, utilizando essa interface eu digo que a label recebe todas as
  // propriedades que o elemento html label possui, assim usando da desestruturação para informar ao componente as props sem precisar ir
  // atributo por atributo!
  return (
    <div className="flex w-screen flex-col gap-10 h-screen justify-center items-center bg-zinc-800">
      <FormProvider {...createUserForm}>
        <form
          onSubmit={handleSubmit(createUser)}
          className="flex bg-zinc-900 flex-col gap-4 max-w-sm w-full p-8 rounded-lg "
        >
          <Form.Field>
            <Form.Label htmlFor="avatar"> Avatar</Form.Label>
            <Form.Input name="avatar" type="file" />
            <Form.ErrorMessage field="avatar" />
          </Form.Field>

          {/* Jeito que foi feito primeiramente */}
          <Form.Field>
            <label className="text-white" htmlFor="name">
              Name
            </label>
            <input
              type="name"
              className="py-2 bg-zinc-950 shadow-lg text-white rounded-lg"
              {...register("name")}
            />
            {errors.name && (
              <span className=" text-red-500 text-sm py-2">
                {errors.name.message}
              </span>
            )}
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="email">Email</Form.Label>
            <Form.Input name="email" type="email" />
            <Form.ErrorMessage field="email" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Input name="password" type="password" />
          </Form.Field>

          <Form.Field>
            <Form.Label>
              Tecnologias
              <Form.Button type="button" onClick={addNewTech}>
                Add tech
              </Form.Button>
            </Form.Label>
          </Form.Field>
          {/* Aqui eu realizo um map pelas tecnologias presentes no formulário mostrando-as conforme o indice, como pode ser visto na 
parte do register */}
          {fields.map((field, index) => {
            return (
              <div className="flex w-full gap-4" key={field.id}>
                <input
                  type="text"
                  className="py-2  bg-zinc-950 shadow-lg text-white rounded-lg"
                  {...register(`techs.${index}.title`)}
                />
                {errors?.techs?.[index]?.title && (
                  <span className=" text-red-500 text-sm py-2">
                    {errors.techs[index]?.title?.message}
                  </span>
                )}
                {/* <Form.Input type="number" name={`techs.${index}.knowLedge`}></Form.Input> */}
                <input
                  type="number"
                  className="py-2 flex-1 flex min-w-min w-full  bg-zinc-950 shadow-lg text-white rounded-lg"
                  {...register(`techs.${index}.knowLedge`)}
                />
              </div>
            );
          })}
          {errors.techs && (
            <span className=" text-red-500 text-sm py-2">
              {errors.techs.message}
            </span>
          )}
          <button
            type="submit"
            className="py-3 text-white bg-emerald-800 hover:bg-emerald-950 shadow-lg rounded-lg"
          >
            Salvar
          </button>
        </form>
      </FormProvider>
      <pre className="text-white">{output}</pre>
    </div>
  );
}
