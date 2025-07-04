// Estrutura base para o projeto NeuroForma 3D
import process from 'node:process';

export const globalMemory = Array<any>();
export const neuronMemory = Array<any>();

type NeuronExecution = [
    0 | 1 | 2 | 3, // Tipo de parâmetro: 0=valor, 1=variável, 2=neurônio estático, 3=neurônio dinâmico
    number[], // Índices do neurônio
    NeuronExecution[] // Parâmetros de entrada do neurônio
]

type NeuronExecutions = [
    number, // Tipo de execução: 0=sequencial, 1=paralela esperando por todos, 2=paralela esperando pelo primeiro, 3=paralela sem esperar
    NeuronExecution[] // Array de execuções de neurônios
]

type DynamicNeuron = NeuronExecutions[];

type StaticNeuron =
    (...execute: any[]) => any;

type InputRedirectNeurons = StaticNeuron[];
type OutputRedirectNeurons = StaticNeuron[];
type CRUDNeurons = StaticNeuron[];
type MathNeurons = StaticNeuron[];
type SystemNeurons = StaticNeuron[];
type StorageNeurons = StaticNeuron[];

type StaticNeurons = [
    InputRedirectNeurons,
    OutputRedirectNeurons,
    CRUDNeurons,
    MathNeurons,
    SystemNeurons,
    StorageNeurons
];

type InputNeurons = [
    // Neurônios de entrada dinâmicos
    DynamicNeuron[], // Neurônios de imagem
    DynamicNeuron[], // Neurônios de áudio
    DynamicNeuron[], // Neurônios de vídeo
    DynamicNeuron[]  // Neurônios de texto
];

type DynamicExecutionNeurons = DynamicNeuron[][]

type DynamicNeurons = [
    InputNeurons, // Neurônios de entrada dinâmicos
    DynamicExecutionNeurons // Execuções dinâmicas
];

type Neurons = [
    StaticNeurons,
    DynamicNeurons
];

export const input = (...values: any[]) => {
    // Função para enviar dados para o modelo
    return neurons[1][0].map((neuron: any, index: number) => neuron(...values[index]));
}

export const output = (...values: any[]) => {
    // Função para o modelo enviar dados de volta
    console.log("Recebendo dados:", values);
    return values;
}

export const generateNeuron = (type: number, index: number, execute: DynamicNeuron) => {
    neurons[1][type][index].push(execute);
    return true;
}

export const removeNeuron = (type: number, index: number) => {
    if (neurons[1][type][index]) {
        delete neurons[1][type][index];
        return true;
    }
    return false;
}

export const updateNeuron = (type: number, index: number, position: number, execute: DynamicNeuron) => {
    if (neurons[1][type][index]) {
        neurons[1][type][index][position] = execute;
    }
    return false;
}

// 2. Registro global de neurônios
export const neurons: Neurons = [
    [ // Neurônios státicos
        [// Neurônios de entrada
            (...values: any[]) => {
                return input(...values);
            }
        ],
        [// Neurônios de saida
            (...values: any[]) => {
                return output(...values);
            }
        ],
        [ // Neurônios de alteração de neurônios aleatórios
            // create neurons
            (type: number, index: number, execute: DynamicNeuron) => {
                return generateNeuron(type, index, execute);
            },
            // remove neurons
            (type: number, index: number) => {
                return removeNeuron(type, index);
            },
            // update neurons
            (type: number, index: number, position: number, execute: DynamicNeuron) => {
                return updateNeuron(type, index, position, execute);
            }
        ],
        [ // Neurônios matemáticos
            (...values: number[]) => values.reduce((a, b) => a + b, 0), // Soma
            (...values: number[]) => values.reduce((a, b) => a - b), // Subtração
            (...values: number[]) => values.reduce((a, b) => a * b, 1), // Multiplicação
            (...values: number[]) => values.reduce((a, b) => a / b), // Divisão
            (...values: number[]) => values.reduce((a, b) => a % b), // Módulo
            (max: number, ...values: number[]) => Math.max(max, ...values), // Máximo
            (min: number, ...values: number[]) => Math.min(min, ...values), // Mínimo
            (...values: number[]) => values.reduce((a, b) => a + b, 0) / values.length, // Média
            (...values: number[]) => values.reduce((a, b) => a * b, 1) ** (1 / values.length), // Geométrica
            (...values: number[]) => values.reduce((a, b) => a + Math.pow(b - values.reduce((c, d) => c + d, 0) / values.length, 2), 0) / (values.length - 1), // Variância
            (...values: number[]) => Math.sqrt(values.reduce((a, b) => a + Math.pow(b - values.reduce((c, d) => c + d, 0) / values.length, 2), 0) / (values.length - 1)), // Desvio padrão
            (...values: number[]) => {
                const sorted = [...values].sort((a, b) => a - b);
                const mid = Math.floor(sorted.length / 2);
                return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2; // Mediana
            },
            (...values: number[]) => values.map(value => Math.floor(value)), // Converter para inteiro
            (value: number) => Math.abs(value), // Módulo
            (value: number) => Math.sqrt(value), // Raiz quadrada
            (value: number) => Math.pow(value, 2), // Potência
            (value: number) => Math.log(value), // Logaritmo
            (value: number) => Math.exp(value), // Exponencial
            (value: number) => Math.sin(value), // Seno
            (value: number) => Math.cos(value), // Cosseno
            (value: number) => Math.tan(value), // Tangente
            (value: number) => Math.asin(value), // Arco seno
            (value: number) => Math.acos(value), // Arco cosseno
            (value: number) => Math.atan(value), // Arco tangente
            (value: number) => Math.ceil(value), // Arredondamento para cima
            (value: number) => Math.floor(value), // Arredondamento para baixo
            (value: number) => Math.round(value), // Arredondamento
            (value: number) => Math.trunc(value), // Truncamento
            (value: number) => Math.sign(value), // Sinal
            (max: number, min: number) => Math.random() * (max - min) + min, // Aleatório entre dois valores
            (value: number) => value % 1, // Parte decimal
            (value: number) => Math.log10(value), // Logaritmo base 10
            (value: number) => Math.log2(value), // Logaritmo base 2
            (value: number) => Math.hypot(value), // Hipotenusa
            (value: number) => Math.cbrt(value), // Raiz cúbica
            (value: number) => Math.fround(value), // Float de precisão simples
        ],
        [ // Neurônios de sistema
            () => process.memoryUsage(), // Uso de memória
            () => process.cpuUsage(), // Uso de CPU
            () => process.uptime(), // Tempo de atividade do processo
            () => Date.now(), // Tempo atual em milissegundos
            () => // Dinamic Neuron Size
                {
                    const neuronSize = neurons[1].reduce((acc, curr) => acc + curr.length, 0);
                    return neuronSize;
                }
        ],
        [// Neurônios de armazenamento
            (index: number, value: any) => { // Armazenamento global simples
                globalMemory[index] = value;
                return value;
            },
            (index: number) => globalMemory[index], // Recuperação de memória global
            (index: number, value: any) => {
                neuronMemory[index] = value; // Armazenamento em memória local
                return value;
            },
            (index: number) => neuronMemory[index], // Recuperação de memória local
            (index: number) => {
                delete neuronMemory[index]; // Remoção de memória local
                return true;
            },
            (index: number) => {
                delete globalMemory[index]; // Remoção de memória global
                return true;
            }
        ],
    ],
    [ // Neurônios dinâmicos
        [ // Neurônios de input
            [ // image neurons

            ],
            [ // audio neurons
    
            ],
            [ // video neurons
    
            ],
            [ // text neurons

            ]    
        ],
        [ // Neurônios de executions

        ],
    ],
];

// 6. Simulação de execução
(async () => {
    const result = await executeNeuron("soma1", [3, 4]);
    console.log("Resultado da soma:", result);
})();
