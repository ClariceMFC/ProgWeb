<?php
/* @var $this yii\web\View */
use yii\helpers\Url;

$this->registerJsFile("");

$this->registerJs("
	var pontuacao = 6000;
	$.ajax({
		url: '" . Url::to(['jogo/save']) . "',
		type: 'GET',
		data: {
			'pontuacao':pontuacao,
		},
		error: function () {
			console.log('Deu ruim :p');
		},
		sucess: function (data) {
			console.log(data);
		},
	});
");

?>
<h1>jogo/index</h1>
<div id="montanha"></div>

<p>
    You may change the content of this page by modifying
    the file <code><?= __FILE__; ?></code>.
</p>
