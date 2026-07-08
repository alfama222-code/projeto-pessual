const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const produtos = [
  { id: "1", name: "Coxinha de Frango Cream Cheese", type: "salgado", price: 120, description: "Frango desfiado com requeijão cremoso e casca super crocante.", image: "https://tse4.mm.bing.net/th/id/OIP.IP-zKrRI4lo8_VEHwRn35AHaE8?r=0&cb=thfc1falcon4&rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: "2", name: "Brigadeiro Gourmet Belga", type: "doce", price: 80, description: "Chocolate belga 54% cacau granulado em raspas puras.", image: "https://loremflickr.com/600/400/brigadeiro,chocolate?lock=2" },
  { id: "3", name: "Pastel de Chaves", type: "salgado", price: 150, description: "Massa folhada autêntica com recheio de carne bem temperada.", image: "https://loremflickr.com/600/400/pastry,meat?lock=3" },
  { id: "4", name: "Rissole de Camarão", type: "salgado", price: 180, description: "Salgado frito com recheio cremoso de camarão selecionado.", image: "https://loremflickr.com/600/400/rissole,fried?lock=4" },
  { id: "5", name: "Fatia de Bolo de Cenoura", type: "doce", price: 200, description: "Bolo fofinho com uma cobertura generosa de brigadeiro quente.", image: "https://loremflickr.com/600/400/carrot,cake?lock=5" },
  { id: "6", name: "Pastel de Nata", type: "salgado", price: 130, description: "Receita tradicional com massa folhada crocante e creme no ponto ideal.", image: "https://loremflickr.com/600/400/pastel,nata?lock=6" },
  { id: "7", name: "Empada de Camarão", type: "salgado", price: 180, description: "Empada feita com massa leve e recheio cremoso de camarão.", image: "https://loremflickr.com/600/400/shrimp,pie?lock=7" },
  { id: "8", name: "Bolo de Chocolate", type: "doce", price: 200, description: "Bolo fofinho com uma cobertura generosa de brigadeiro quente.", image: "https://loremflickr.com/600/400/chocolate,cake?lock=8" },
  { id: "9", name: "Bolo de Baunilha", type: "doce", price: 200, description: "Bolo fofinho com uma cobertura generosa de brigadeiro quente.", image: "https://loremflickr.com/600/400/vanilla,cake?lock=9" },
  { id: "10", name: "Torta de Limão", type: "doce", price: 220, description: "Torta cremosa com base crocante e cobertura de merengue.", image: "https://loremflickr.com/600/400/lemon,tart?lock=10" },
  { id: "11", name: "Mini Churros", type: "doce", price: 180, description: "Porção de mini churros com recheio de doce de leite.", image: "https://loremflickr.com/600/400/churros?lock=11" },
  { id: "12", name: "Quiche de Alho Poró", type: "salgado", price: 150, description: "Quiche leve com massa fina e recheio cremoso de alho poró.", image: "https://loremflickr.com/600/400/quiche?lock=12" },
  { id: "13", name: "Empadão de Frango", type: "salgado", price: 190, description: "Empadão caseiro com massa podre e recheio suculento.", image: "https://loremflickr.com/600/400/chicken,pie,food?lock=13" },
  { id: "14", name: "Mini Pizzas", type: "salgado", price: 160, description: "Mini pizzas variadas com massa fina e ingredientes selecionados.", image: "https://loremflickr.com/600/400/mini,pizza?lock=14" },
  { id: "15", name: "Coxinha de Carne Seca", type: "salgado", price: 140, description: "Coxinha recheada com carne seca desfiada e catupiry.", image: "https://loremflickr.com/600/400/meat,snack?lock=15" },
  { id: "16", name: "Sonho de Doce de Leite", type: "doce", price: 120, description: "Sonho recheado com doce de leite caseiro e cobertura açucarada.", image: "https://loremflickr.com/600/400/donut,cream?lock=16" },
  { id: "17", name: "Rocambole de Brigadeiro", type: "doce", price: 230, description: "Rocambole fofo recheado com brigadeiro gourmet.", image: "https://loremflickr.com/600/400/swiss,roll,chocolate?lock=17" },
  { id: "18", name: "Torta Holandesa", type: "doce", price: 250, description: "Torta gelada com base de biscoito, creme branco e cobertura de chocolate.", image: "https://loremflickr.com/600/400/pie,chocolate,dessert?lock=18" },
];

async function main() {
  console.log('Limpando produtos antigos...');
  await prisma.produto.deleteMany();

  console.log('Iniciando o cadastro dos produtos...');
  for (const prod of produtos) {
    await prisma.produto.create({
      data: prod,
    });
  }
  console.log('✅ Todos os produtos foram cadastrados com sucesso no banco de dados!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
