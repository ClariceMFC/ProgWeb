<?php
/* @var $this yii\web\View */
?>
<h1>jogo/ranking</h1>

<?php

foreach ($jogadas as $jogada){
	echo $jogada->user->username, " => ", $jogada->$pontuacao, "<br>";
} 

?>