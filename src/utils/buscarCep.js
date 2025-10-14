export const buscarCep = async (cep) => {
  const cepLimpo = cep.replace(/\D/g, '');

  if (cepLimpo.length !== 8) {
    throw new Error('CEP deve conter 8 dígitos.');
  }

  const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  const data = await response.json();

  if (data.erro) {
    throw new Error('CEP não encontrado.');
  }

  return {
    logradouro: data.logradouro,
    bairro: data.bairro,
    cidade: data.localidade,
    estado: data.uf
  };
};