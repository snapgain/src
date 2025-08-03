// src/data/platforms.js

export const affiliateId = 'SEU_ID_AFILIADO';

export const aviosPartners = [
  { id: 'ba', name: 'British Airways Avios', url: 'https://www.shopping.ba.com/', affiliate: true },
  { id: 'aviosEStore', name: 'Avios eStore', url: 'https://www.avios.com/estore', affiliate: true },
  { id: 'iberiaPlusStore', name: 'Iberia Plus Store', url: 'https://www.iberiaplusstore.com/', affiliate: true },
  { id: 'aerClub', name: 'AerClub eStore', url: 'https://www.aerclubestore.com/', affiliate: true },
  // ...adicionar mais parceiros Avios
];

export const cashbackPlatforms = [
  { id: 'topcashback', name: 'TopCashback UK', url: `https://www.topcashback.co.uk/ref/${affiliateId}`, affiliate: true },
  { id: 'quidco', name: 'Quidco UK', url: `https://www.quidco.com/user/${affiliateId}`, affiliate: true },
  { id: 'ameDigital', name: 'Ame Digital', url: `https://www.amedigital.com/?ref=${affiliateId}`, affiliate: true },
  { id: 'melhoresOfertas', name: 'Melhores Ofertas', url: `https://melhoresofertas.com/?ref=${affiliateId}`, affiliate: true },
  { id: 'santanderBoost', name: 'Santander Boost', url: `https://www.santanderboost.com/?ref=${affiliateId}`, affiliate: true },
  { id: 'barclaysBlueRewards', name: 'Barclays Blue Rewards', url: `https://www.barclays.co.uk/bluerewards/?ref=${affiliateId}`, affiliate: true },
  { id: 'lloydsBank', name: 'Lloyds Bank Everyday Offers', url: `https://www.lloydsbank.com/offers/?ref=${affiliateId}`, affiliate: true },
  { id: 'hsbcHomeAndAway', name: 'HSBC Home & Away', url: `https://www.homeandaway.hsbc.com/?ref=${affiliateId}`, affiliate: true },
  // ...adicionar mais bancos e plataformas UK
];

export function getAffiliateLink(reward, selectedStore) {
  let platformLink = reward.affiliateLink;
  if (reward.type === 'cashback') {
    const platform = cashbackPlatforms[0];
    platformLink = platform.url + '&store=' + (selectedStore[0]?.value || '');
  }
  if (reward.type === 'points') {
    const avios = aviosPartners[0];
    platformLink = avios.url + '?store=' + (selectedStore[0]?.value || '') + '&ref=' + affiliateId;
  }
  return platformLink;
}

// Função utilitária para requisições externas
export async function fetchApi(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Erro na requisição: ' + response.status);
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
}

// Função para normalizar dados vindos de APIs
export function normalizeRewards(apiData) {
  // Exemplo: transforma dados externos em formato padrão do app
  return apiData.map(item => ({
    id: item.id,
    name: item.name,
    type: item.type,
    amount: item.amount,
    affiliateLink: item.affiliateLink,
    description: item.description,
    icon: item.icon,
    rate: item.rate,
  }));
}
