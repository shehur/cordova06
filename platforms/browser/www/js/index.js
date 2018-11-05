var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    receivedEvent: function(id) {
        var novo = document.getElementById('novo');

        // linhas de exibição de dados na tabela
        var linhas = document.getElementById('linhas');

        // objetos de controle do banco de dados
        var database = firebase.database();

        // exibição dos dados cadastrados
        database.ref('produtos').on('value', function(dados) {
            var content = '';
            dados.forEach(function(item){
                var Codigo = item.key;
                var Nome = item.val().Nome;
                var Numero = item.val().Numero;
                var Path = item.val().Path;
                var Path_temp = Path.replace('?', '-n-').replace('&', '-e-').replace('=', '-i-').trim();

                content +=
                "<tr>" +
                    "<td id='nome_" + Codigo + "'>" + Nome + "</td>" +
                    "<td id='numero_" + Numero + "'>" + Numero + "</td>" +
                    "<td>" +
                        "<img src='" + Path + "' width='30px' height='30px' alt='sem imagem' id='imagem_" + Codigo + "' />" +
                    "</td>" +
                    "<td align='right'><a href='cadastro.html?codigo=" + Codigo + "&nome=" + Nome + "&numero=" + Numero + "&path=" + Path_temp + "'>selecionar</a></td>" +
                "</tr>";
            });
            linhas.innerHTML = content;
        });

        novo.addEventListener('click', function() {
            //window.location.href = '../cadastro.html?codigo=&nome=&numero=&path=';
            window.location.href = '../cadastro.html';
        });
    }
};

app.initialize();