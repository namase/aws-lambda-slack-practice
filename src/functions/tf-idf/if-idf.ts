interface TfInformations extends Object {
    dfmap: { key: string, value: number }[];
    wordTotal: number;
    sentenceValue: number;
    sentence: string;
    priority: number;
}

let kuromoji: any = require('kuromoji');

let builder: any = kuromoji.builder({
    dicPath: 'node_modules/kuromoji/dict'
});

// 形態素解析機を作るメソッド
builder.build(function (err: any, tokenizer: any) {
    if (err) { throw err; }
    const tokens: any = tokenizer.tokenize("全仏に15年連続出場となるジョコビッチは、2016年の決勝でアンディ・マレー（イギリス）を倒して生涯グランドスラム（キャリアを通じて4つのグランドスラムのすべてを制すること）を達成。昨年は準々決勝で、マルコ・チェッキナート（イタリア）に3-6 6-7(4) 6-1 6-7(11)で敗れていた。今年の大会でジョコビッチが優勝すると、「ダブルグランドスラム」（4大大会2回以上制覇）の偉業を達成することになる。この結果でジョコビッチは、ストルフとの対戦成績を2勝0敗とした。両者は2017年1月にドーハ（ATP250／ハードコート）の1回戦で初対戦しており、ジョコビッチが7-6(1) 6-3で勝っていた。今大会でのジョコビッチは、1回戦でホベルト・ホルカシュ（ポーランド）を6-4 6-2 6-2で、2回戦でラッキールーザーのヘンリー・ラクソネン（スイス）を6-1 6-4 6-3で、3回戦では予選勝者のサルバトーレ・カルーゾ（イタリア）を6-3 6-3 6-2で破って16強入りを決めていた。ジョコビッチは準々決勝で、第5シードのアレクサンダー・ズベレフ（ドイツ）と第9シードのファビオ・フォニーニ（イタリア）の勝者と対戦する。");

    // console.log(tokens);

    // TF := 文章中の登場回数 df用 mapを作る(ローカルで完結)
    // IDF := 文書中の登場回数 idf用 mapを作る
    // 文章は句点で終わることを前提とする

    // 文書中の「名詞」の総数
    let totalWordsInDocument: number = 0;
    // 文章中の「名詞」の数
    let totalWordsInSentence: number = 0;
    // 文書中の「文章」の数
    let totalSentences: number = 0;
    // 文書中の「名詞」の数
    let idfMap = new Map<string, number>();
    // 各文章の「名詞」の数
    let tfArray: Array<TfInformations> = [];
    // 各単語のIDFを計算した結果を格納するMap Object
    let idfValue = new Map<string, number>();
    // 対数関数の底
    const logBase: number = 2;

    let df: { key: string, value: number }[] = [];
    let idf = new Map<string, number>();
    let sentence: string = '';
    // 単語を数える
    for (let wordInformation of tokens) {

        sentence += wordInformation.surface_form;

        switch (wordInformation.pos) {
            case '記号':
                if (wordInformation.pos_detail_1 === '句点') {
                    // console.log(df);
                    df.forEach((value) => {
                        // console.log(value);
                        if (idfMap.has(value.key)) {
                            let count: number = idfMap.get(value.key);
                            ++count;
                            idfMap.set(value.key, count);
                        } else {
                            idfMap.set(value.key, 1);
                        }
                    });
                    // console.log(idfMap);
                    let tfArrayObj: TfInformations = {
                        dfmap: df,
                        wordTotal: totalWordsInSentence,
                        sentenceValue: 0,
                        sentence: sentence,
                        priority: totalSentences
                    };
                    // console.log(tfArrayObj);
                    totalWordsInDocument += totalWordsInSentence;
                    ++totalSentences;
                    sentence = '';
                    tfArray.push(tfArrayObj);
                }
                break;
            case '名詞':

                ++totalWordsInSentence;

                let wordCountIdf: number = 0;
                let word: string = wordInformation.surface_form;

                let isHas = false;
                df.forEach((x) => {
                    if (x.key === word) {
                        isHas = !isHas;
                    }
                });

                if (!isHas) {
                    df.push(
                        {
                            key: word,
                            value: 1
                        }
                    );
                } else {
                    df.forEach((x) => {
                        if (x.key === word) {
                            x.value++;
                        }
                    });
                }

                if (idf.has(word)) {
                    idf.set(word, 1); // someone is sutitable for second param.
                }

                idf.set(word, wordCountIdf);
                break;
            default:
                // do nothing
                ;
        }
    }
    // console.log(idfMap);
    // IDFを計算
    idfMap.forEach((value, key) => {
        const wordIdf = getBaseLog(logBase, totalSentences / value + 1);
        idfValue.set(key, wordIdf);
        // console.log(wordIdf);
    });

    let tfValue: number = 0;
    for (let i = 0; i < tfArray.length; ++i) {
        const content: TfInformations = tfArray[i];
        const contentMap: { key: string, value: number }[] = content.dfmap;
        const total: number = content.wordTotal;
        // console.log(contentMap);
        // console.log(content);
        // tfを計算
        contentMap.forEach((value) => {
            const tf = value.value / total;
            tfValue += tf * idfValue.get(value.key);
        });

        tfArray[i].sentenceValue = tfValue;
    }

    tfArray.sort((a, b) => {
        return (a.sentenceValue < b.sentenceValue ? 1 : -1);
    })

    let ans: TfInformations[] = tfArray.slice(0, (tfArray.length > 3) ? 3 : tfArray.length);

    ans.sort((a, b) => {
        return (a.priority < b.priority ? -1 : 1);
    })

    ans.forEach((x) => {
        console.log(x.sentence)
        console.log(x.sentenceValue)
    })
});

// xを底とする yの対数を返す
function getBaseLog(x: number, y: number): number {
    return Math.log(y) / Math.log(x);
}
