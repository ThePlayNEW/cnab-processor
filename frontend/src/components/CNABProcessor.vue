<template>
    <div class="min-h-screen bg-gray-50">
        <header class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 class="text-3xl font-bold tracking-tight text-gray-900">Processador CNAB</h1>
            </div>
        </header>

        <main class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <section class="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-200 bg-gray-50">
                    <h2 class="text-xl font-semibold text-gray-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                        Upload de Arquivo CNAB
                    </h2>
                </div>

                <div class="p-6">
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex-1">
                            <p class="text-sm text-gray-600 mb-4">
                                Selecione um arquivo CNAB para processar. O sistema irá analisar o arquivo, normalizar
                                os dados e armazená-los no banco de dados.
                            </p>

                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2" for="file">
                                Arquivo CNAB
                                </label>
                                
                                <div class="relative">
                                <label 
                                    for="file" 
                                    class="group cursor-pointer flex justify-center items-center p-4 border-2 border-dashed rounded-lg transition-colors"
                                    :class="[
                                    isDragging 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-300 hover:border-blue-500'
                                    ]"
                                    @dragover.prevent="isDragging = true"
                                    @dragleave.prevent="isDragging = false"
                                    @drop.prevent="handleFileDrop"
                                >
                                    <div class="space-y-2 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 transition-colors" :class="isDragging ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <div class="text-sm" :class="isDragging ? 'text-blue-500' : 'text-gray-600 group-hover:text-blue-500'">
                                        <span class="font-medium">
                                        {{ isDragging ? 'Solte o arquivo aqui' : 'Clique para selecionar' }}
                                        </span>
                                        <span v-if="selectedFile" class="block mt-1 text-blue-600">
                                        Arquivo selecionado: {{ selectedFile.name }}
                                        </span>
                                        <span v-else class="block mt-1">
                                        ou arraste e solte aqui
                                        </span>
                                    </div>
                                    </div>
                                </label>
                                <input 
                                    type="file" 
                                    id="file" 
                                    ref="fileInput"
                                    @change="handleFileSelected"
                                    class="hidden"
                                />
                                </div>
                            </div>

                            <button @click="uploadFile" :disabled="!selectedFile || isLoading"
                                class="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                <span v-if="isLoading">Processando...</span>
                                <span v-else>Processar Arquivo</span>
                            </button>
                        </div>

                        <div class="flex-1 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                            <h3 class="text-sm font-medium text-gray-700 mb-2">Formato esperado do arquivo CNAB</h3>
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200 text-xs">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th scope="col"
                                                class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Campo</th>
                                            <th scope="col"
                                                class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Posição</th>
                                            <th scope="col"
                                                class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tamanho</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        <tr>
                                            <td class="px-3 py-1">Tipo</td>
                                            <td class="px-3 py-1">1</td>
                                            <td class="px-3 py-1">1</td>
                                        </tr>
                                        <tr>
                                            <td class="px-3 py-1">Data</td>
                                            <td class="px-3 py-1">2-9</td>
                                            <td class="px-3 py-1">8</td>
                                        </tr>
                                        <tr>
                                            <td class="px-3 py-1">Valor</td>
                                            <td class="px-3 py-1">10-19</td>
                                            <td class="px-3 py-1">10</td>
                                        </tr>
                                        <tr>
                                            <td class="px-3 py-1">CPF</td>
                                            <td class="px-3 py-1">20-30</td>
                                            <td class="px-3 py-1">11</td>
                                        </tr>
                                        <tr>
                                            <td class="px-3 py-1">Cartão</td>
                                            <td class="px-3 py-1">31-42</td>
                                            <td class="px-3 py-1">12</td>
                                        </tr>
                                        <tr>
                                            <td class="px-3 py-1">Hora</td>
                                            <td class="px-3 py-1">43-48</td>
                                            <td class="px-3 py-1">6</td>
                                        </tr>
                                        <tr>
                                            <td class="px-3 py-1">Dono</td>
                                            <td class="px-3 py-1">49-62</td>
                                            <td class="px-3 py-1">14</td>
                                        </tr>
                                        <tr>
                                            <td class="px-3 py-1">Loja</td>
                                            <td class="px-3 py-1">63-81</td>
                                            <td class="px-3 py-1">19</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div v-if="uploadMessage" class="mt-6">
                        <div class="rounded-md p-4 flex" :class="{
                            'bg-green-50 text-green-800': uploadStatus === 'success',
                            'bg-red-50 text-red-800': uploadStatus === 'error'
                        }">
                            <div class="flex-shrink-0">
                                <svg v-if="uploadStatus === 'success'" class="h-5 w-5 text-green-400"
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd" />
                                </svg>
                                <svg v-else class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm font-medium">{{ uploadMessage }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section v-if="stores.length > 0" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-white rounded-xl shadow-md overflow-hidden">
                        <div class="p-5 bg-indigo-50">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                    <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div class="ml-5">
                                    <p class="text-sm font-medium text-indigo-600 truncate">Total de Lojas</p>
                                    <p class="text-3xl font-bold text-indigo-900">{{ stores.length }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white px-5 py-3">
                            <div class="text-sm">
                                <span class="font-medium text-indigo-600">{{ totalWithPositiveBalance }}</span>
                                <span class="text-gray-500"> com saldo positivo</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-md overflow-hidden">
                        <div class="p-5 bg-emerald-50">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 bg-emerald-500 rounded-md p-3">
                                    <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div class="ml-5">
                                    <p class="text-sm font-medium text-emerald-600 truncate">Total de Transações</p>
                                    <p class="text-3xl font-bold text-emerald-900">{{ totalTransactions }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white px-5 py-3">
                            <div class="text-sm">
                                <span class="font-medium text-emerald-600">{{ enteringTransactions }}</span>
                                <span class="text-gray-500"> entradas, </span>
                                <span class="font-medium text-red-600">{{ exitingTransactions }}</span>
                                <span class="text-gray-500"> saídas</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-md overflow-hidden">
                        <div class="p-5" :class="totalBalance >= 0 ? 'bg-green-50' : 'bg-red-50'">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 rounded-md p-3"
                                    :class="totalBalance >= 0 ? 'bg-green-500' : 'bg-red-500'">
                                    <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div class="ml-5">
                                    <p class="text-sm font-medium truncate"
                                        :class="totalBalance >= 0 ? 'text-green-600' : 'text-red-600'">
                                        Saldo Total
                                    </p>
                                    <p class="text-3xl font-bold"
                                        :class="totalBalance >= 0 ? 'text-green-900' : 'text-red-900'">
                                        {{ formatCurrency(totalBalance) }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white px-5 py-3">
                            <div class="text-sm">
                                <span class="font-medium text-gray-900">Última atualização:</span>
                                <span class="text-gray-500"> {{ getCurrentDateTime() }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-md overflow-hidden">
                    <div class="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h2 class="text-xl font-semibold text-gray-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500"
                                viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                            </svg>
                            Detalhamento por Loja
                        </h2>

                        <div class="flex items-center">
                            <div class="relative max-w-xs">
                                <input type="text" placeholder="Buscar loja..." v-model="searchTerm"
                                    class="block w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>

                            <select v-model="sortBy"
                                class="ml-3 pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md">
                                <option value="name">Nome (A-Z)</option>
                                <option value="balance">Saldo (Maior-Menor)</option>
                                <option value="transactions">Nº de Transações</option>
                            </select>
                        </div>
                    </div>

                    <div class="p-6">
                        <div v-if="filteredStores.length === 0" class="text-center py-12 px-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhuma loja encontrada</h3>
                            <p class="mt-1 text-sm text-gray-500">Tente modificar os critérios de busca.</p>
                        </div>

                        <div v-else class="space-y-4">
                            <div v-for="(store, index) in filteredStores" :key="index"
                                class="border rounded-lg overflow-hidden" :class="{
                                    'border-green-200': store.balance > 0,
                                    'border-red-200': store.balance < 0,
                                    'border-gray-200': store.balance === 0
                                }">
                                <div @click="toggleStore(index)"
                                    class="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-medium"
                                            :class="{
                                                'bg-green-500': store.balance > 0,
                                                'bg-red-500': store.balance < 0,
                                                'bg-gray-500': store.balance === 0
                                            }">
                                            {{ store.name.charAt(0) }}
                                        </div>
                                        <div class="ml-4">
                                            <h3 class="font-bold text-gray-900">{{ store.name }}</h3>
                                            <p class="text-sm text-gray-600">{{ store.owner }}</p>
                                        </div>
                                    </div>

                                    <div class="flex items-center space-x-4">
                                        <div class="text-right">
                                            <p class="text-sm text-gray-500">{{ store.transactions.length }} transações
                                            </p>
                                            <p class="font-bold" :class="{
                                                'text-green-600': store.balance > 0,
                                                'text-red-600': store.balance < 0,
                                                'text-gray-600': store.balance === 0
                                            }">
                                                {{ formatCurrency(store.balance) }}
                                            </p>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            class="h-5 w-5 text-gray-400 transition-transform duration-200"
                                            :class="openStores[index] ? 'transform rotate-180' : ''" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                <div v-if="openStores[index]"
                                    class="border-t border-gray-200 bg-gray-50 p-4 transition-all duration-200 ease-in-out">
                                    <div class="bg-white rounded-lg shadow overflow-hidden">
                                        <div class="overflow-x-auto">
                                            <table class="min-w-full divide-y divide-gray-200">
                                                <thead class="bg-gray-50">
                                                    <tr>
                                                        <th scope="col"
                                                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Tipo</th>
                                                        <th scope="col"
                                                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Data/Hora</th>
                                                        <th scope="col"
                                                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            CPF</th>
                                                        <th scope="col"
                                                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Cartão</th>
                                                        <th scope="col"
                                                            class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Valor</th>
                                                    </tr>
                                                </thead>
                                                <tbody class="bg-white divide-y divide-gray-200">
                                                    <tr v-for="(transaction, tIndex) in store.transactions"
                                                        :key="tIndex" class="hover:bg-gray-50">
                                                        <td class="px-4 py-3 whitespace-nowrap">
                                                            <span
                                                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                                                :class="{
                                                                    'bg-green-100 text-green-800': transaction.nature === 'Entrada',
                                                                    'bg-red-100 text-red-800': transaction.nature === 'Saída'
                                                                }">
                                                                {{ transaction.typeDescription }}
                                                            </span>
                                                        </td>
                                                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                            {{ formatDate(transaction.date) }} - {{ transaction.time }}
                                                        </td>
                                                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                            {{ formatCPF(transaction.cpf) }}
                                                        </td>
                                                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                            {{ formatCard(transaction.card) }}
                                                        </td>
                                                        <td class="px-4 py-3 whitespace-nowrap text-sm text-right font-medium"
                                                            :class="{
                                                                'text-green-600': transaction.signedValue > 0,
                                                                'text-red-600': transaction.signedValue < 0,
                                                                'text-gray-600': transaction.signedValue === 0
                                                            }">
                                                            {{ formatCurrency(transaction.value) }}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div class="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
                                            <div class="text-right">
                                                <span class="text-sm text-gray-700">Saldo Total:</span>
                                                <span class="ml-2 font-medium" :class="{
                                                    'text-green-600': store.balance > 0,
                                                    'text-red-600': store.balance < 0,
                                                    'text-gray-600': store.balance === 0
                                                }">
                                                    {{ formatCurrency(store.balance) }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section v-else-if="!isLoading && !uploadMessage" class="flex flex-col items-center justify-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 class="mt-4 text-lg font-medium text-gray-900">Nenhum dado para exibir</h3>
                <p class="mt-1 text-sm text-gray-500">Faça o upload de um arquivo CNAB para começar.</p>
            </section>
        </main>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'CNABProcessor',

    data() {
        return {
            selectedFile: null,
            isDragging: false,
            isLoading: false,
            uploadMessage: '',
            uploadStatus: '',
            stores: [],
            openStores: {},
            searchTerm: '',
            sortBy: 'name'
        };
    },

    computed: {
        totalTransactions() {
            return this.stores.reduce((total, store) => total + store.transactions.length, 0);
        },

        totalBalance() {
            return this.stores.reduce((total, store) => {
                const balance = store.balance || 0;
                return total + (isNaN(balance) ? 0 : Number(balance));
            }, 0);
        },

        totalWithPositiveBalance() {
            return this.stores.filter(store => store.balance > 0).length;
        },

        enteringTransactions() {
            return this.stores.reduce((total, store) => {
                return total + store.transactions.filter(t => t.nature === 'Entrada').length;
            }, 0);
        },

        exitingTransactions() {
            return this.stores.reduce((total, store) => {
                return total + store.transactions.filter(t => t.nature === 'Saída').length;
            }, 0);
        },

        filteredStores() {
            let result = [...this.stores];

            if (this.searchTerm) {
                const term = this.searchTerm.toLowerCase();
                result = result.filter(store =>
                    store.name.toLowerCase().includes(term) ||
                    store.owner.toLowerCase().includes(term)
                );
            }

            switch (this.sortBy) {
                case 'name':
                    result.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'balance':
                    result.sort((a, b) => b.balance - a.balance);
                    break;
                case 'transactions':
                    result.sort((a, b) => b.transactions.length - a.transactions.length);
                    break;
            }

            return result;
        }
    },

    methods: {
        handleFileSelected(event) {
            this.selectedFile = event.target.files[0];
            this.uploadMessage = '';
        },
    
        handleFileDrop(event) {
            this.isDragging = false;
            
            if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
                this.selectedFile = event.dataTransfer.files[0];
                this.uploadMessage = '';
                
                if (this.$refs.fileInput) {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(this.selectedFile);
                    this.$refs.fileInput.files = dataTransfer.files;
                }
            }
        },

        async uploadFile() {
            if (!this.selectedFile) return;

            this.isLoading = true;
            this.uploadMessage = '';

            const formData = new FormData();
            formData.append('file', this.selectedFile);

            try {
                await axios.post('http://localhost:3000/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                this.uploadStatus = 'success';
                this.uploadMessage = 'Arquivo processado com sucesso!';

                await this.loadStoreData();

                this.$refs.fileInput.value = '';
                this.selectedFile = null;
            } catch (error) {
                this.uploadStatus = 'error';
                this.uploadMessage = `Erro ao processar arquivo: ${error.response?.data?.error || error.message}`;
            } finally {
                this.isLoading = false;
            }
        },

        async loadStoreData() {
            try {
                const response = await axios.get('http://localhost:3000/api/stores');
                this.stores = response.data;

                this.openStores = {};
                this.stores.forEach((_, index) => {
                    this.openStores[index] = false;
                });
            } catch (error) {
                console.error('Erro ao carregar dados das lojas:', error);
            }
        },

        toggleStore(index) {
            this.openStores[index] = !this.openStores[index];
        },

        formatCurrency(value) {
            if (value === null || value === undefined || isNaN(value)) {
                return 'R$ 0,00';
            }

            const numValue = Number(value);

            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(numValue);
        },

        formatDate(dateString) {
            if (!dateString) return '';

            const [year, month, day] = dateString.split('-');
            return `${day}/${month}/${year}`;
        },

        formatCPF(cpf) {
            if (!cpf) return '';
            
            const digits = cpf.replace(/\D/g, '');
            
            if (digits.length !== 11) return cpf;
            
            return `${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6, 9)}-${digits.substring(9, 11)}`;
        },

        formatCard(card) {
            if (!card) return '';
            
            if (card.includes('*')) {
                const firstPart = card.split('*')[0];
                const lastPart = card.split('****')[1] || '';
                
                return `${firstPart.substring(0, 4)} **** **** ${lastPart}`;
            } 
            
            const digits = card.replace(/\D/g, '');
            
            if (digits.length === 16) {
                return `${digits.substring(0, 4)} ${digits.substring(4, 8)} ${digits.substring(8, 12)} ${digits.substring(12, 16)}`;
            }
            
            return card;
        },

        getCurrentDateTime() {
            const now = new Date();

            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');

            return `${day}/${month}/${year} ${hours}:${minutes}`;
        }
    },

    mounted() {
        this.loadStoreData();
    }
};
</script>