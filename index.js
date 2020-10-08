const fs = require('fs');
const pdf = require('pdf-parse');

function render_page(pageData){
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

let palavraChave = [
            {atividade: "simples de API", value: 1},
            {atividade: "média de API", value: 3},
            {atividade: "complexa de API", value: 6},
            {atividade: "simples de console", value: 3},
            {atividade: "média de console", value: 8},
            {atividade: "complexa de console", value: 12},
            {atividade: "simples de procedure", value: 1},
            {atividade: "média de procedure", value: 4},
            {atividade: "complexa de procedure", value: 8},
            {atividade: "simples de tabela", value: 1},
            {atividade: "média de tabela", value: 3},
            {atividade: "complexa de tabela", value: 6},
            {atividade: "simples de formulário", value: 1},
            {atividade: "média de formulário", value: 3},
            {atividade: "complexa de formulário", value: 6},
            {atividade: "simples de job", value: 2},
            {atividade: "média de job", value: 5},
            {atividade: "complexa de job", value: 10},
            {atividade: "simples de trigger", value: 1},
            {atividade: "média de trigger", value: 3},
            {atividade: "complexa de trigger", value: 6},
            {atividade: "simples de função", value: 1},
            {atividade: "média de função", value: 3},
            {atividade: "complexa de função", value: 6},
            {atividade: "simples de script", value: 1},
            {atividade: "média de script", value: 3},
            {atividade: "complexa de script", value: 6},
            {atividade: "simples de modelagem", value: 1},
            {atividade: "média de modelagem", value: 3},
            {atividade: "complexa de modelagem", value: 6},
            {atividade: "simples do relatório", value: 3},
            {atividade: "média do relatório", value: 8},
            {atividade: "complexa do relatório", value: 12}            
    ];

let totalDeHoras = 0;

let dataBuffer = fs.readFileSync('./levantamento.pdf');

pdf(dataBuffer, options)
    .then(data => {
        let text = data.text.split(',');
        text.forEach(item =>{
            palavraChave.forEach(palavra =>{
                let itemReplaced = item.replace(/  /g, ' ');
                if(itemReplaced.indexOf(palavra.atividade) != -1){
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