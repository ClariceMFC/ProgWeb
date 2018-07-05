<?php

use yii\helpers\Html;

/* @var $this yii\web\View */

//http://localhost/clarice/frontend/web/index.php?r=site%2Findex

$this->title = 'My Yii Application';
?>
<div class="site-index">

    <div class="jumbotron">
        <h1>Ski Free</h1>

        <?= Html::img('@web/img/yeti.jpg',['width'=>'400']) ?>
        <?= Html::a('Iniciar jogo',['jogo/index']) ?>

        <p><a class="btn btn-lg btn-success" href="linkpujogo.html">Iniciar jogo!</a></p>
    </div>

    <div class="body-content">

    </div>
</div>
