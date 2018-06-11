<?php

/* @var $this yii\web\View */

use yii\helpers\Html;

$this->title = 'About';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="site-about">
    <h1><?= Html::encode($this->title) ?></h1>

    <p>This is the About page. You may modify the following file to customize its content:</p>

    <p>Uma breve descricao aqui? .-.</p>

    <p>Dia e hora atual: </p>

    <code><?= date("d/m/Y H:i:s") ?></code>

    <code><?= __FILE__ ?></code>
</div>
