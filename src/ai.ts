// Estrutura base para o projeto NeuroForma 3D
import process from 'process';

export const globalMemory = Array<any>();
export const neuronMemory = Array<any>();

type ParamType = 0 | 1 | 2 | 3 | 4; // 0=valor, 1= param, 2=variável, 3=neurônio estático, 4=neurônio dinâmico

type ExecutionType = 0 | 1 | 2 | 3; // 0=sequencial, 1=paralela esperando por todos, 2=paralela esperando pelo primeiro, 3=paralela sem esperar

//(index)(params: Param[]){
//     NeuronExecutions[] // Parâmetros de entrada do
// }

type StaticNeuronIndex = [0, number,number];

type DynamicNeuronIndex = [1, number,number,number];

type NeuronIndex = StaticNeuronIndex | DynamicNeuronIndex; // Índice do neurônio: estático ou dinâmico,

type Param = [
    ParamType, // Tipo de parâmetro: 0=valor, 1=variável (valor em memoria), 2=neurônio estático, 3=neurônio dinâmico
    number | any, // Índices do neurônio ou do valor em memoria ou valor
]

type NeuronExecution = [
    NeuronIndex, // Índices do neurônio
    Param[], // Parâmetros de entrada do neurônio
    number, // Index da memória do neurônio
]

type NeuronExecutions = [
    ExecutionType,
    NeuronExecution[] // Array de execuções de neurônios
]

type ParamDefinition = any // Valor padrão do parâmetro


type DynamicNeuron = [
    ParamDefinition[],
    NeuronExecutions[],
]

type StaticNeuron =
    (...execute: any[]) => any;

type InputRedirectNeurons = StaticNeuron[];
type OutputRedirectNeurons = StaticNeuron[];
type CRUDNeurons = StaticNeuron[];
type MathNeurons = StaticNeuron[];
type SystemNeurons = StaticNeuron[];
type StorageNeurons = StaticNeuron[];

type InputNeurons = [
    // Neurônios de entrada dinâmicos
    DynamicNeuron[], // Neurônios de imagem
    DynamicNeuron[], // Neurônios de áudio
    DynamicNeuron[], // Neurônios de vídeo
    DynamicNeuron[]  // Neurônios de texto
];

type DynamicExecutionNeurons = DynamicNeuron[][]

type StaticNeurons = [
    InputRedirectNeurons,
    OutputRedirectNeurons,
    CRUDNeurons,
    MathNeurons,
    SystemNeurons,
    StorageNeurons
];

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

function generateRandomNeuronExecution(): NeuronExecution {
    return [
        0, // Tipo de parâmetro: valor
        [0, 1], // Índices do neurônio
        [] // Parâmetros de entrada vazios
    ];
}

function generateRandomNeuronExecutions(): NeuronExecutions {
    return [
        generateRandomNaturalNumber(3) as ExecutionType, // Tipo de execução: sequencial, paralela esperando por todos, etc.
        Array.from({ length }, () => generateRandomNeuronExecution())
    ];
}

function generateRandomNaturalNumber(max = 100000000000000): number {
    const value = Math.floor(Math.random() * max);
    return value < 0 ? 0 : value; // Garantir que o número seja natural (não negativo)
}

function generateRandomNumber(): number {
    // genertae a random value between -infinite and infinite
    const isInteger = Math.random() < 0.5;
    const isNegative = Math.random() < 0.5;

    let value;
    if (isInteger) {
        value = generateRandomNaturalNumber();
        value = isNegative ? -value : value;
    } else {
        const max = 1e+308;
        value = Math.random() * max;
        value = isNegative ? -value : value;
    }
    return value;
}

function generateRandomArray(): number[] {
    const length = generateRandomNaturalNumber();
    return Array.from({ length }, () => generateRandomNumber());
}

function generateRandomDynamicNeuron(): DynamicNeuron {
    return [
        generateRandomArray(), // Tipo de execução: sequencial
        Array.from({ length }, () => generateRandomNeuronExecutions())
    ];
}

// 6. Simulação de execução
(async () => {
    const result = await executeNeuron("soma1", [3, 4]);
    console.log("Resultado da soma:", result);
})();
