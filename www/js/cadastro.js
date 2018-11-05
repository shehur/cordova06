// campos de entrada de dados
var codigo = document.getElementById('codigo');
var nome = document.getElementById('nome');
var numero = document.getElementById('numero');
var path = document.getElementById('path');

// botões de ação
var cancelar = document.getElementById('cancelar');
var salvar = document.getElementById('salvar');
var deletar = document.getElementById('deletar');
var arquivo = document.getElementById('arquivo');

// objetos de controle do banco de dados
var database = firebase.database();
var storage = firebase.storage();

cancelar.addEventListener('click', cancelar_);
salvar.addEventListener('click', salvar_);
deletar.addEventListener('click', deletar_);

// captura e armazenamento do arquivo
arquivo.addEventListener('change', function(e) {
    salvar.disabled = true;
    deletar_imagem_();
    var file = e.target.files[0];
    var data = new Date();
    var refe = storage.ref('arquivos/' + data.getDate() + data.getMonth() + data.getYear() + data.getTime() + '_' + file.name);
    var task = refe.put(file);

    task.on('state_changed', function(dados) {
    var percent = (dados.bytesTransferred / dados.totalBytes) * 100;

	    if(percent >= 100) {
	        dados.ref.getDownloadURL().then(function(url) {
	            path.value = url;
	            salvar.disabled = false;
	        }).catch(function(error) {
	            alert('ERRO: ' + error.code + ' - MOTIVO: ' + error.message);
	        });
	    }
    });
});

function salvar_() {
	var Codigo = codigo.value.trim();
	var Nome = nome.value.trim();
	var Numero = parseInt(numero.value);

	if(Codigo != null && Nome != null && Nome.length > 0 && Numero != null && Numero > 0) {
		if(Codigo != '-1') {
			editar_();
		}else {
			inserir_();
		}
	}else {
		nome.focus();
		alert('Preencha os campos VAZIOS!');
	}
}

function inserir_() {
    var json = {Nome: nome.value.trim(), Numero: parseInt(numero.value), Path: path.value.trim()};
    database.ref('produtos').push(json, function(error) {
        if(error) {
            alert('ERRO: ' + error.code + ' - MOTIVO: ' + error.message);
        }else {
            cancelar_();
            alert('Registro INSERIDO com SUCESSO!');
        }
    });
}

function editar_() {
    var json = {};
    if(path.value.trim().length > 0) {
        json = {Nome: nome.value.trim(), Numero: parseInt(numero.value), Path: path.value.trim()};
    }else {
        json = {Nome: nome.value.trim(), Numero: parseInt(numero.value)};
    }

    database.ref('produtos/' + codigo.value.trim()).update(json, function(error) {
        if(error) {
            alert('ERRO: ' + error.code + ' - MOTIVO: ' + error.message);
        }else {
        	cancelar_();
            alert('Registro EDITADO com SUCESSO!');
        }
    });
}

function deletar_() {
    if(confirm('Confirma DELEÇÃO?')) {
    	deletar_imagem_();
        database.ref('produtos/' + codigo.value.trim()).remove(function(error) {
            if(error) {
                alert('ERRO: ' + error.code + ' - MOTIVO: ' + error.message);
            }else {
                cancelar_();
            }
        });
    }
}

function cancelar_() {
    window.location.href = '../index.html';
}

function deletar_imagem_() {
    var Path = path.value.trim();
    if(Path.length > 0) {
        var v_path = Path.split('%2F');
        var v_nome = v_path[1].split('?');
        var nome = v_nome[0].trim();

        storage.ref('arquivos/' + nome).delete().then(function() {
        	console.log('imagem anterior deletada');
        }).catch(function(error) {
        	alert('ERRO: ' + error.code + ' - MOTIVO: ' + error.message);
        });
    }
}