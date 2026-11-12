# Portal de Poá Open Mall — novo site

Site institucional estático (HTML + CSS + JS puro, sem build e sem dependências).
Basta abrir o `index.html` no navegador ou subir a pasta inteira em qualquer
hospedagem (Vercel, Netlify, Hostinger, S3, cPanel…).

## Estrutura

```
novo site portal open mall/
├── index.html              página única com todas as seções
├── css/style.css           design system + componentes + responsivo
├── js/main.js              efeitos e interações (zero libs)
├── assets/img/             logos, fotos das novidades
│   ├── logo-portal-branco.png
│   ├── logo-portal.png
│   ├── historia/           ← coloque aqui as fotos da linha do tempo
│   ├── marcas/             ← coloque aqui os logos dos lojistas
│   └── novidades/          ← coloque aqui as fotos dos cards de novidades
└── referencias/            os 4 slides do carrossel que originaram o texto
```

## Seções

| Âncora         | Seção                                                            |
|----------------|------------------------------------------------------------------|
| `#inicio`      | Hero com o manifesto ("de posto a espaço de experiências")       |
| `#conceito`    | O que é o open mall + 3 pilares (estrutura, localização, experiência) |
| `#historia`    | Linha do tempo 1976 → 2005 → 2009 → 2023 → 2025/26               |
| `#marcas`      | Sky Fit, Natura, HP Portal + card "sua marca aqui"               |
| `#futuro`      | Vislumbre do futuro (entretenimento, gastronomia, 24h, serviços) |
| `#novidades`   | Cards com filtro por categoria (obra / marcas / comunidade)      |
| `#eventos`     | Agenda de eventos                                                |
| `#lojista`     | "Quero ser lojista": benefícios + formulário comercial           |
| `#localizacao` | Endereço + mapa                                                  |

O conteúdo veio do site atual (wixsite) somado aos textos do carrossel de
história que está em `referencias/`.

## Efeitos implementados

- Preloader com a assinatura da marca
- Entrada do título do hero linha a linha (máscara + slide)
- Reveal progressivo no scroll com atraso em cascata (`data-delay`)
- Parallax no fundo do hero e glow flutuante
- Barra de progresso de leitura no topo
- Header que encolhe e ganha blur ao rolar + link da seção ativa
- Contadores animados (1976, 50+, 24h)
- Linha do tempo com traço que preenche conforme o scroll e pontos que acendem
- Ticker infinito de marcas (pausa no hover)
- Tilt 3D nos cards e botões magnéticos (só em mouse, nunca no toque)
- Filtro de novidades com re-animação dos cards
- Labels flutuantes e máscara de telefone no formulário
- Menu mobile em painel lateral

Tudo respeita `prefers-reduced-motion` e o site continua legível com o JS desligado.

## O que falta preencher (conteúdo real)

1. **Fotos da história em alta resolução** — as 6 fotos em
   `assets/img/historia/` foram **recortadas de dentro dos slides do
   carrossel**, então são pequenas (212 a 334px de largura) e já tinham
   passado por compressão de rede. Na tela elas aparecem com 298px, então
   seguram bem, mas não dá para ampliar mais nem usar em tela cheia. Vale
   pedir os originais para a família.

   Para trocar, basta substituir o arquivo pelo de mesmo nome e atualizar
   `width`/`height` no `index.html`.

2. **Fotos das novidades** — os cards ainda usam placeholders da marca (fundo
   vinho com legenda). Para usar foto real, acrescente a classe `has-img` e o
   `background-image` **no próprio HTML**:

   ```html
   <!-- antes -->
   <div class="news-card__media" data-label="Foto da obra"></div>
   <!-- depois -->
   <div class="news-card__media has-img" style="background-image:url('assets/img/novidades/obra.jpg')"></div>
   ```

   > A URL precisa ficar no HTML, não no CSS: dentro do `style.css` ela seria
   > resolvida a partir da pasta `css/` e quebraria.

3. **Novidades e eventos** — as 4 novidades e os 4 eventos são exemplos com a
   estrutura final. Textos, datas e imagens precisam ser confirmados.

4. **Formulário** — hoje valida e mostra mensagem de sucesso no front, mas não
   envia para lugar nenhum. Em `js/main.js`, seção 9, há o ponto marcado com
   `TODO` para plugar o endpoint (Formspree, n8n, API própria ou WhatsApp).

5. **Contato** — faltam telefone, e-mail e links reais de Instagram/Facebook
   (os `href="#"` do rodapé).

6. **Logos das marcas** — Sky Fit, Natura e HP Portal estão como texto. Com os
   logos em PNG/SVG em `assets/img/marcas/`, dá para trocar.

7. **Logo do Portal** — o `logo-portal-branco.png` veio do projeto antigo e tem
   um fundo circular escuro embutido. Vale substituir por um SVG com fundo
   transparente.

8. **Mascotes** — ficaram fora do site por ora (decisão de deixar para 2027,
   com a capivara). A arte já tratada (fundo recortado e logo da camiseta
   recolorido para o dourado) está no histórico do git, no commit `65d36a1`:
   `git show 65d36a1:assets/img/mascotes.webp > mascotes.webp`.

## Paleta

| Token        | Hex       | Uso                          |
|--------------|-----------|------------------------------|
| `--wine-900` | `#2E0810` | fundos escuros               |
| `--wine-700` | `#5E1222` | base da marca                |
| `--crimson`  | `#C32A42` | realces quentes              |
| `--gold`     | `#C9A66B` | CTAs, detalhes, eyebrow      |
| `--cream`    | `#F7F4F1` | fundo claro e texto no escuro|
| `--ink`      | `#171013` | texto no claro               |

Tipografia: **Outfit** (texto) + **Cormorant Garamond** itálico (acentos, no
espírito da assinatura "Portal de Poá").
