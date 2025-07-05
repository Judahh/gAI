// Estrutura base para o projeto NeuroForma 3D
import process from 'process';

export const globalMemory = Array<any>();
export const neuronMemory = Array<any>();

type ParamType = 0 | 1 | 2 | 3 // 0=valor, 1=param, 2=variável, 3=neurônio

type ExecutionType = 0 | 1 | 2 | 3; // 0=sequencial, 1=paralela esperando por todos, 2=paralela esperando pelo primeiro, 3=paralela sem esperar

//(index)(params: Param[]){
//     NeuronExecutions[] // Parâmetros de entrada do
// }

type StaticNeuronIndex = [0, number,number];

type DynamicNeuronIndex = [1, number,number,number];

type NeuronIndex = StaticNeuronIndex | DynamicNeuronIndex; // Índice do neurônio: estático ou dinâmico,

type Param = [
    ParamType, // Tipo de parâmetro
    number | NeuronIndex, // Índices do neurônio ou do valor em memoria ou valor
]

type NeuronExecution = [
    NeuronIndex, // Índices do neurônio
    Param[], // Parâmetros de entrada do neurônio
]

type NeuronExecutions = [
    ExecutionType,
    NeuronExecution[] // Array de execuções de neurônios
]

type DynamicNeuron = [
    number, // numero de parâmetros
    NeuronExecutions[],
]

type StaticNeuron =[
    number, // numero de parâmetros
    (...execute: any[]) => any
];

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

export const getStaticNeurons = (): StaticNeurons => {
    return neurons[0];
}

export const getDynamicNeurons = (): DynamicNeurons => {
    return neurons[1];
}

export const getTotalDynamicNeurons = (): number => {
    const dynamicNeurons = getDynamicNeurons();
    let total = 0;
    for (let i = 0; i < dynamicNeurons.length; i++) {
        for (let j = 0; j < dynamicNeurons[i].length; j++) {
            total += dynamicNeurons[i][j].length; // Soma o tamanho de cada tipo de neurônio dinâmico
        }
    }
    return total;
}

export const generateRandomNeuronIndex = (): NeuronIndex => {
    const isStatic = Math.random() < 0.5; // 50% de chance de ser estático
    if (isStatic) {
        const staticNeurons = getStaticNeurons();
        const length = staticNeurons.length;
        const staticNeuronIndex = generateRandomNaturalNumber(length);
        const staticNeuronI2Length = staticNeurons[staticNeuronIndex].length;
        const staticNeuronI2Index = generateRandomNaturalNumber(staticNeuronI2Length);
        return [0, staticNeuronIndex, staticNeuronI2Index]; // Índice do neurônio estático
    } else {
        const dynamicNeurons = getDynamicNeurons();
        const length = dynamicNeurons[0].length; // Considerando o primeiro tipo de neurônio dinâmico
        const dynamicNeuronIndex = generateRandomNaturalNumber(length);
        const dynamicNeuronI2Length = dynamicNeurons[0][dynamicNeuronIndex].length;
        const dynamicNeuronI2Index = generateRandomNaturalNumber(dynamicNeuronI2Length);
        const dynamicNeuronI3Length = dynamicNeurons[1][dynamicNeuronIndex].length;
        const dynamicNeuronI3Index = generateRandomNaturalNumber(dynamicNeuronI3Length);
        return [1, dynamicNeuronIndex, dynamicNeuronI2Index, dynamicNeuronI3Index]; // Índice do neurônio dinâmico
    }
}

export const generateRandomParam = (): Param => {
    const type = generateRandomNaturalNumber(3) as ParamType; // Tipo de parâmetro
    if (type === 0) {
        return [0, generateRandomNumber()]; // Valor
    } else if (type === 1) {
        return [1, generateRandomNaturalNumber()]; // Variável (valor em memória)
    } else {
        return [2, generateRandomNeuronIndex()]; // Neurônio
    }
}

export const generateRandomNeuronExecution = (): NeuronExecution => {
    const neuronIndex = generateRandomNeuronIndex();
    let neuron;
    if (neuronIndex[0] === 0) {
        neuron = neurons[neuronIndex[0]][neuronIndex[1]][neuronIndex[2]];
    } else {
        neuron = neurons[neuronIndex[0]][neuronIndex[1]][neuronIndex[2]][neuronIndex[3]];
    }
    const length = neuron[0];
    return [
        neuronIndex, // Índice do neurônio
        generateArray(length, generateRandomParam) // Parâmetros de entrada do neurônio
    ];
}

export const generateRandomNeuronExecutions = (): NeuronExecutions => {
    const length = generateRandomNaturalNumber();
    return [
        generateRandomNaturalNumber(3) as ExecutionType, // Tipo de execução: sequencial, paralela esperando por todos, etc.
        generateArray(length, generateRandomNeuronExecution)
    ];
}

export const generateRandomNaturalNumber = (max = 100000000000000): number => {
    const value = Math.floor(Math.random() * max);
    return value < 0 ? 0 : value; // Garantir que o número seja natural (não negativo)
}

export const generateRandomParamNumber = (max = 100000000000000): number => {
    const value = generateRandomNaturalNumber(max);
    return (value < 0 ? 0 : value) - 1;
}

export const generateRandomNumber = (): number => {
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

export const generateArray = <T>(length: number, generator: ()=>T): T[] => {
    return Array.from({ length }, generator);
}

export const generateRandomDynamicNeuron = (): DynamicNeuron => {
    const length = generateRandomNaturalNumber();
    return [
        generateRandomParamNumber(), // Tipo de execução: sequencial
        generateArray(length, generateRandomNeuronExecutions) // Array de execuções de neurônios
    ];
}

export const generateRandomDynamicNeurons = (): DynamicNeuron[] => {
    const length = generateRandomNaturalNumber();
    return generateArray(length, generateRandomDynamicNeuron);
}

// TODO: fix params
export const executeNeuron = async (neuronIndex: NeuronIndex, params: any[]): Promise<any> => {
    if(neuronIndex[0] == 0) {
        const staticNeuron = neurons[0][neuronIndex[1]][neuronIndex[2]];
        return staticNeuron[1](...params); // Executa o neurônio estático
    } else {
        const dynamicNeuron = neurons[1][neuronIndex[1]][neuronIndex[2]][neuronIndex[3]];
        const executions = dynamicNeuron[1];
        const results: any[] = [];
        for (const execution of executions) {
            const executionType = execution[0];
            const neuronExecution = execution[1];
            let promises: Promise<any>[] = [];
            switch (executionType) {
                case 0: // Sequencial
                    for (const exec of neuronExecution) {
                        const result = await executeNeuron(exec[0], exec[1]);
                        results.push(result);
                    }
                    break;
                case 1: // Paralela esperando por todos
                    promises = neuronExecution.map(exec => executeNeuron(exec[0], exec[1]));
                    results.push(...await Promise.all(promises));
                    break;
                case 2: // Paralela esperando pelo primeiro
                    promises = neuronExecution.map(exec => executeNeuron(exec[0], exec[1]));
                    results.push(...await Promise.race(promises));
                    break;
                case 3: // Paralela sem esperar
                    neuronExecution.forEach(exec => executeNeuron(exec[0], exec[1]));
                    break;
            }
        }
    }
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
            [   
                -1,
                (...values: any[]) => {
                    return input(...values);
                }
            ]
        ],
        [// Neurônios de saida
            [   
                -1,
                (...values: any[]) => {
                    return output(...values);
                }
            ]
        ],
        [ // Neurônios de alteração de neurônios aleatórios
            // create neurons
            [3, (type: number, index: number, execute: DynamicNeuron) => {
                return generateNeuron(type, index, execute);
            }],
            // remove neurons
            [2, (type: number, index: number) => {
                return removeNeuron(type, index);
            }],
            // update neurons
            [4, (type: number, index: number, position: number, execute: DynamicNeuron) => {
                return updateNeuron(type, index, position, execute);
            }],
            [0, generateRandomDynamicNeuron],
            [0, generateRandomNeuronExecutions],
            [0, generateRandomNeuronExecution],
            [0, generateRandomParam],
            [0, generateRandomNeuronIndex],
        ],
        [ // Neurônios matemáticos
            [-1,(...values: number[]) => values.reduce((a, b) => a + b, 0)], // Soma
            [-1,(...values: number[]) => values.reduce((a, b) => a - b)], // Subtração
            [-1,(...values: number[]) => values.reduce((a, b) => a * b, 1)], // Multiplicação
            [-1,(...values: number[]) => values.reduce((a, b) => a / b)], // Divisão
            [-1,(...values: number[]) => values.reduce((a, b) => a % b)], // Módulo
            [-1,(max: number, ...values: number[]) => Math.max(max, ...values)], // Máximo
            [-1,(min: number, ...values: number[]) => Math.min(min, ...values)], // Mínimo
            [-1,(...values: number[]) => values.reduce((a, b) => a + b, 0) / values.length], // Média
            [-1,(...values: number[]) => values.reduce((a, b) => a * b, 1) ** (1 / values.length)], // Geométrica
            [-1,(...values: number[]) => values.reduce((a, b) => a + Math.pow(b - values.reduce((c, d) => c + d, 0) / values.length, 2), 0) / (values.length - 1)], // Variância
            [-1,(...values: number[]) => Math.sqrt(values.reduce((a, b) => a + Math.pow(b - values.reduce((c, d) => c + d, 0) / values.length, 2), 0) / (values.length - 1))], // Desvio padrão
            [-1,(...values: number[]) => {
                const sorted = [...values].sort((a, b) => a - b);
                const mid = Math.floor(sorted.length / 2);
                return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2; // Mediana
            }],
            [-1,(...values: number[]) => values.map(value => Math.floor(value))], // Converter para inteiro
            [1,(value: number) => Math.abs(value)], // Módulo
            [1,(value: number) => Math.sqrt(value)], // Raiz quadrada
            [1,(value: number) => Math.pow(value, 2)], // Potência
            [1,(value: number) => Math.log(value)], // Logaritmo
            [1,(value: number) => Math.exp(value)], // Exponencial
            [1,(value: number) => Math.sin(value)], // Seno
            [1,(value: number) => Math.cos(value)], // Cosseno
            [1,(value: number) => Math.tan(value)], // Tangente
            [1,(value: number) => Math.asin(value)], // Arco seno
            [1,(value: number) => Math.acos(value)], // Arco cosseno
            [1,(value: number) => Math.atan(value)], // Arco tangente
            [1,(value: number) => Math.ceil(value)], // Arredondamento para cima
            [1,(value: number) => Math.floor(value)], // Arredondamento para baixo
            [1,(value: number) => Math.round(value)], // Arredondamento
            [1,(value: number) => Math.trunc(value)], // Truncamento
            [1,(value: number) => Math.sign(value)], // Sinal
            [2,(max: number, min: number) => Math.random() * (max - min) + min], // Aleatório entre dois valores
            [1,(value: number) => value % 1], // Parte decimal
            [1,(value: number) => Math.log10(value)], // Logaritmo base 10
            [1,(value: number) => Math.log2(value)], // Logaritmo base 2
            [1,(value: number) => Math.hypot(value)], // Hipotenusa
            [1,(value: number) => Math.cbrt(value)], // Raiz cúbica
            [1,(value: number) => Math.fround(value)], // Float de precisão simples
            [0,() => Math.PI], // Pi
            [0,() => Math.E], // Euler
            [0,() => Math.random], // Raiz quadrada de 2
            [0, generateRandomNumber],
            [0, generateRandomNaturalNumber], // Número natural aleatório
            [0, generateRandomParamNumber], // Parâmetro aleatório
        ],
        [ // Neurônios de sistema
            [0,() => process.memoryUsage()], // Uso de memória
            [0,() => process.cpuUsage()], // Uso de CPU
            [0,() => process.uptime()], // Tempo de atividade do processo
            [0,() => Date.now()], // Tempo atual em milissegundos
            [0,() => getTotalDynamicNeurons()] // Total de neurônios dinâmicos
        ],
        [// Neurônios de armazenamento
            [2,(index: number, value: any) => { // Armazenamento global simples
                globalMemory[index] = value;
                return value;
            }],
            [1,(index: number) => globalMemory[index]], // Recuperação de memória global
            [1,(index: number) => {
                delete globalMemory[index]; // Remoção de memória global
                return true;
            }]
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
