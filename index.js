const fs = require('fs');
const pdf = require('pdf-parse');
const { palavraChave } = require('./palavrasChave');

function render_page(pageData) {
    let render_options = {
        normalizeWhitespace: false,
        disableCombineTextItems: false
    }

    return pageData.getTextContent(render_options)
        .then(function(textContent) {
            let pdfArray = [];
            for (let item of textContent.items) {
                pdfArray.push(item.str);
            }
            return pdfArray;
        });
}

let options = {
    pagerender: render_page
}

let totalDeHoras = 0;

let dataBuffer = fs.readFileSync('./levantamento.pdf');

pdf(dataBuffer, options)
    .then(data => {
        let text = data.text.split(',');
        text.forEach(item => {
            palavraChave.forEach(palavra => {
                let itemReplaced = item.replace(/  /g, ' ');
                if (itemReplaced.indexOf(palavra.atividade) != -1) {
                    totalDeHoras += palavra.value;
                }
            });
        })

        console.table([
            ['Total de horas calculadas: ', `${totalDeHoras} horas`],
            ['Total de horas análise: ', text[text.length - 7]],
            ['Total de horas desenvolvimento: ', text[text.length - 5]],
            ['Total de horas homologação: ', text[text.length - 3]],
            ['Total geral levantamento: ', text[text.length - 1]],

        ])
    })
    .catch(error => {
        console.log(error);
    })