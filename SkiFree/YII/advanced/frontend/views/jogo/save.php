<?php
/* @var $this yii\web\View */
?>
<h1>jogo/save</h1>

<p>
    You may change the content of this page by modifying
    the file <code><?= __FILE__; ?></code>.
</p>

<!--
public function actionSave ($pontuacao) {

	if (!Yii::$app->user->isGuest) { // Checando se o usuário está logado
		$jogada = new Jogada;
		$jogada->id_user = Yii::$app->user->id;
		$jogada->pontuacao = $pontuacao;

		if ($jogada->save()) {
			return 1;
		} else {
			return 0;
		}
	}
}
-->