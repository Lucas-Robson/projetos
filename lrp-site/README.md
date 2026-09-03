# LRP Assistência Contábil — site institucional

Site estático em HTML, CSS e JavaScript, responsivo e sem dependência de framework.

## Arquivos para inserir antes de publicar

Crie a pasta `assets/` (já incluída) e adicione:

- `assets/logo.png` — logo oficial da LRP.
- `assets/leonina.jpg` — foto profissional real da Leonina Rose Pedroso.

O layout já possui fallback visual caso esses arquivos ainda não existam.

## Contatos

Os botões de WhatsApp e e-mail estão intencionalmente sem número/endereço fictício. Antes de publicar:

1. Troque os links `href="#contato"` relacionados ao WhatsApp pelo link oficial `https://wa.me/...`.
2. Troque o e-mail pelo endereço oficial usando `mailto:`.
3. Conecte o formulário a um backend, Formspree, Resend, API própria ou outro serviço escolhido.

## Hero

A imagem usada na primeira dobra é uma foto gratuita do Pexels, de Jakub Zerdzicki:
https://www.pexels.com/photo/office-desktop-home-accounting-equipment-16213402/

Se preferir, substitua o `src` da imagem dentro de `.hero-image-wrap` por uma imagem própria.

## Publicação

Pode ser publicado diretamente em Vercel, Netlify, GitHub Pages ou hospedagem tradicional. O arquivo inicial é `index.html`.
