/**
 * DoubleDispatchパターン (Gofとは関係ない）
 * メソッドの引数の1つが表すClassに基づいて、何かを実行したいときにIF文が発生するのを防ぐ。
 * 引数のクラスをチェックするのではなく、引数対象の各クラスに、"同じ名前のメソッド(二次的なメソッド)"を追加する。
 * オブジェクトが何を実行するかは、二次的なメッセージを受信する側のオブジェクトの責務とする。
 */
namespace BadCord {
    // Messageの受信者（Rock, Paper, Scissors）が、渡される引数について多くのことを知り過ぎている。
    // クラスが増えるたびに、IF文が追加されることになる。
    class Rock {
        public beats(obj: Object): boolean {
            if (obj.constructor.name === "Paper") {
                return false;
            }
            if (obj.constructor.name === "Rock") {
                return false;
            }
            if (obj.constructor.name === "Scissors") {
                return true;
            }
            return false;
        }
    }

    class Paper {
        public beats(obj: Object): boolean {
            if (obj.constructor.name === "Paper") {
                return false;
            }
            if (obj.constructor.name === "Rock") {
                return true;
            }
            if (obj.constructor.name === "Scissors") {
                return false;
            }
            return false;
        }
    }

    class Scissors {
        public beats(obj: Object): boolean {
            if (obj.constructor.name === "Paper") {
                return true;
            }
            if (obj.constructor.name === "Rock") {
                return false;
            }
            if (obj.constructor.name === "Scissors") {
                return false;
            }
            return false;
        }
    }

    export const Run = () => {
        const rock = new Rock();
        const paper = new Paper();
        const scissors = new Scissors();

        console.log(rock.beats(paper));
        console.log(rock.beats(scissors));
        console.log(rock.beats(rock));
    }
}

console.log("---BadCord---");
BadCord.Run();


namespace DoubleDispatch {
    interface GameObject {
        beats(obj: GameObject): boolean;
        beatsRock(): boolean;
        beatsPaper(): boolean;
        beatsScissors(): boolean;
    }

    class Rock implements GameObject {
        public beats(obj: GameObject): boolean {
            // 受信者Rockは、引数objに対してRockに勝てるのか問い合わせる。
            // 引数が勝てない(false)と返してきたら、受信者Rockは勝てるので!false=trueを返す。
            // 引数が勝てる(true)と返してきたら、受信者Rockは負けなので!true=falseを返す。
            // 受信者Rockが知るのは、あくまで"勝てる"か"勝てない"かのどっちかで、引数のクラスのことなど知らなくてよい。
            return !obj.beatsRock();
        }
        public beatsRock(): boolean {
            return true;  // アイコはTrueとする。（結果はFalseとしたい）
        }
        public beatsPaper(): boolean {
            return false;  // RockはPaperに負ける。
        }
        public beatsScissors(): boolean {
            return true;  // RockはScissorsに勝てる。
        }
    }

    class Paper implements GameObject {
        public beats(obj: GameObject): boolean {
            return !obj.beatsPaper();
        }
        public beatsRock(): boolean {
            return true;
        }
        public beatsPaper(): boolean {
            return true;
        }
        public beatsScissors(): boolean {
            return false;
        }
    }

    class Scissors implements GameObject {
        public beats(obj: GameObject): boolean {
            return !obj.beatsScissors();
        }
        public beatsRock(): boolean {
            return false;
        }
        public beatsPaper(): boolean {
            return true;
        }
        public beatsScissors(): boolean {
            return true;
        }
    }

    export const Run = () => {
        const rock = new Rock();
        const paper = new Paper();
        const scissors = new Scissors();

        console.log(rock.beats(paper));
        console.log(rock.beats(scissors));
        console.log(rock.beats(rock));
    }
}

console.log("---DoubleDispatch---");
DoubleDispatch.Run();
