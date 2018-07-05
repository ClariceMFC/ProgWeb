<?php

namespace frontend\controllers;
use common\models\Jogada;
use Yii;

class JogoController extends \yii\web\Controller{

    public function actionIndex(){
        return $this->render('index');
    }

    public function actionRanking(){
        $jogadas = Jogada::find()->orderBy("pontuacao DESC")-> all();
        return $this->render('ranking', [
            'jogadas' => $jogadas,
        ]);
    }

    public function actionSave($pontuacao){
        $jogada = new Jogada;
        $jogada->pontuacao = $pontuacao;
        $jogada->id_user = Yii::$app->user->id;
        
        if ($jogada->save()){
            return "Deu certoo! =^-^=";
        }
        else {
            return "Deu erradoo! ;-;";
        }
    }

}
