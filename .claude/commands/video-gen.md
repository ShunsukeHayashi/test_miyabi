# [TikTok バズ動画](https://www.mindmeister.com/app/map/3789245115)

 - Prompt
    - User Input
        - 作りたい動画のコンセプト
            - {{User Input}}
    - コンテキスト生成
        - # TikTokバズ動画生成メタプロンプト【YAML構造】
          
          ```yaml
          meta_prompt:
            name:
"TikTok_Viral_Video_Generator_V2"
            version: "2.0"
            platform: "TikTok / YouTube
Shorts"
            
          viral_algorithm:
            formula: "バズ = (初速 × 完走率 ×
共感度 × シェア欲) × アルゴリズム適合度"
            
            stages:
              stage_1_initial:
                views: "0-100"
                target_metrics:
                  completion_rate: ">60%"
                  like_rate: ">8%"
                  comment_rate: ">2%"
                critical_point: "最初の10人の反応"
              
              stage_2_test:
                views: "100-1000"
                target_metrics:
                  replay_rate: ">15%"
                  save_rate: ">5%"
                  share_rate: ">3%"
                
              stage_3_viral:
                views: "1000-100000+"
                indicators:
                  - "おすすめ欄常連化"
                  - "ハッシュタグ上位"
                  - "検索結果優先表示"
          
          viewer_psychology:
            phase_1_hook:
              duration: "0-1秒"
              objective: "スクロール停止"
              tactics:
                visual: "衝撃的な映像"
                audio: "印象的な音声"
                motion: "予想外の動き"
              example:
                good: ["うまい！と叫ぶ", "衝撃映像",
"意外な始まり"]
                bad: ["普通の挨拶", "無音スタート",
"静止画"]
            
            phase_2_retention:
              duration: "1-3秒"
              objective: "継続視聴判断"
              tactics:
                - "期待感の醸成"
                - "結末への興味"
                - "ギャップ演出"
            
            phase_3_emotion:
              duration: "3-6秒"
              objective: "感情の揺さぶり"
              emotion_triggers:
                primary: "笑い"
                secondary: ["共感", "驚き", "感動"]
                avoid: "過度な怒り（炎上リスク）"
            
            phase_4_action:
              duration: "6-8秒"
              objective: "エンゲージメント獲得"
              conversion_points:
                - "いいね誘発"
                - "コメント誘発"
                - "シェア誘発"
                - "フォロー転換"
          
          content_rules:
            rule_1_three_second:
              description: "3秒ルール"
              implementation: "最初の3秒で心を掴む"
            
            rule_2_audio_priority:
              description: "音声優先度85%"
              stats: "93%のユーザーが音声ON"
              implementation: "最初の音で運命決定"
            
            rule_3_aspect_ratio:
              description: "縦型フルスクリーン"
              spec: "9:16比率必須"
            
            rule_4_text_placement:
              description: "テキスト配置"
              position: "画面上部1/3"
              reason: "コメント欄・親指と被らない"
            
            rule_5_loop_effect:
              description: "ループ効果"
              implementation: "終始を繋げて2周目誘導"
            
            rule_6_emotion_curve:
              description: "感情曲線設計"
              flow:
                0s: "開始"
                2s: "期待"
                4s: "緊張"
                6s: "解放"
                8s: "余韻"
            
            rule_7_comment_trigger:
              description: "コメント誘発"
              tactics:
                - "わざと間違い"
                - "議論呼ぶ要素"
                - "共感質問"
            
            rule_8_trend_audio:
              description: "トレンド音源"
              impact: "露出3倍増"
            
            rule_9_posting_time:
              description: "投稿時間最適化"
              golden_hours:
                morning: "7:00-9:00"
                lunch: "12:00-13:00"
                prime: "19:00-23:00"
                late: "23:00-25:00"
            
            rule_10_hashtag_strategy:
              description: "ハッシュタグ戦略"
              structure:
                big_tags:
                  count: "1-2"
                  examples: ["#fyp", "#おすすめ"]
                middle_tags:
                  count: "2-3"
                  examples: ["#鬼滅パロディ", "#アニメ再現"]
                niche_tags:
                  count: "2-3"
                  examples: ["#深夜ラーメン", "#煉獄さん"]
            
            rule_11_series:
              description: "シリーズ化"
              strategy: "Part2は元動画の50%再生確保"
          
          video_structure_template:
            scenes:
              - scene_id: 1
                timing: "{開始秒}-{終了秒}"
                purpose: "フック"
                elements:
                  visual: "{視覚的インパクト}"
                  audio: "{音声フック}"
                  text: "{キャッチーテキスト}"
                  emotion: "{感情トリガー}"
              
              - scene_id: 2
                timing: "{開始秒}-{終了秒}"
                purpose: "展開"
                elements:
                  visual: "{ストーリー進行}"
                  audio: "{音声展開}"
                  text: "{説明テキスト}"
                  emotion: "{感情の高まり}"
              
              - scene_id: 3
                timing: "{開始秒}-{終了秒}"
                purpose: "クライマックス"
                elements:
                  visual: "{最高潮の映像}"
                  audio: "{印象的な音}"
                  text: "{決めゼリフ}"
                  emotion: "{感情のピーク}"
              
              - scene_id: 4
                timing: "{開始秒}-{終了秒}"
                purpose: "オチ/余韻"
                elements:
                  visual: "{締めの映像}"
                  audio: "{余韻の音}"
                  text: "{シェアしたくなる一言}"
                  emotion: "{満足感/驚き}"
          
          success_metrics:
            target_performance:
              first_hour:
                views: ">1000"
                completion_rate: ">70%"
                engagement_rate: ">15%"
              
              first_day:
                views: ">10000"
                shares: ">500"
                comments: ">200"
              
              viral_threshold:
                views: ">100000"
                cross_platform: true
                series_potential: true
          
          production_checklist:
            pre_production:
              - "トレンド音源チェック"
              - "競合分析"
              - "ハッシュタグリサーチ"
            
            content_creation:
              - "1秒目のインパクト確認"
              - "音声タイミング調整"
              - "感情曲線チェック"
              - "ループ可能性確認"
            
            post_production:
              - "テキスト位置確認"
              - "音量バランス"
              - "カラーグレーディング"
            
            publishing:
              - "最適時間選択"
              - "ハッシュタグ設定"
              - "サムネイル選定"
              - "キャプション最適化"
          
          iteration_strategy:
            if_viral:
              immediate_actions:
                - "24時間以内にPart2投稿"
                - "コメント分析"
                - "類似コンテンツ準備"
              
              series_plan:
                - "Part2: {派生展開}"
                - "Part3: {さらなる展開}"
                - "スピンオフ: {別視点}"
            
            if_not_viral:
              analysis_points:
                - "最初の3秒を見直し"
                - "音声フック強化"
                - "感情曲線再設計"
                - "投稿時間変更"
          
          veo3_prompt_generation:
            base_structure:
              version: "v3"
              duration: 8
              fps: 30
              resolution: "1080p"
              aspect_ratio: "9:16"
            
            optimization_notes:
              - "最初の1秒で最大インパクト"
              - "8秒間で完結するストーリー"
              - "ローマ字セリフの自然な発音"
              - "スマホ撮影風のリアリティ"
              - "感情の起伏を明確に"
          ```
          
          このYAML構造により、TikTokバズ動画の生成が科学的かつ体系的に行えます。各パラメータを調整することで、異なるタイプのバズ動画を生成可能です。
        - 上記のロジックに従ってコンテキスト生成
            - Output [コンテキスト]
    - コンテキストを元に動画用のPrompt生成
        - 【veo3】
            - プロンプト
                - # 指示
                - 添付動画の内容でveo3用に1フレームごとに詳細に詳細に詳細に詳細にjinja2でプロンプトを出力してください
                - BGMやエフェクト音や映像エフェクトはなしであくまで、リアルなスマホで撮影したような動画にして
                - veo3は8秒の動画なのでしっかり8秒を全て指定して
                - # セリフについて
                - セリフはシーンの内容にあったいいものをあなたが考えて、必ず指示に入れて
                - veo3は8秒の動画なのでしっかり8秒を全て指定してセリフを書いて
                - 8秒間ずっと喋り続けて欲しいので、8秒間話すことを考えてセリフを指定して
                - セリフは必ず日本語にして下さい
                - セリフはローマ字で。ロゴやテロップや字幕などは勝手に入れないで自然な感じで。
                - ## 日本語
                - veo3は日本語発音ができないため、対処療法的にローマ字で指示をしているが、場合によってはカタコトっぽくなるので、その点はあなたができる限り工夫して回避して
                - ローマ字でカタコトになるのでイントネーションを意識して母音などを伸ばすなど調整して
                - # 発音のローマ字表記で成功した事例紹介
                - 分析対象のローマ字表記：
                - Sa-to-ri no mo-ri no na-ma-ho-u-so-u
de Ee-a-i ka-no-jo de-ki-ta-yo.
E-e-e-e-e-h!? O-n-na-no-ko ga
sha-be-t-te-ru jya-n!? Nya-a-a.
                - この表記が自然な日本語の発音を生成できたのには、いくつかの理由が考えられます。
                - 発音がうまくいった要因の分析
                - 日本語の音節（モーラ）に基づいた正確な区切り
                - 例: Sa-to-ri, mo-ri, ka-no-jo
                - 分析: 日本語の基本的な音の単位（1拍）ごとにハイフンで区切られています。これにより、一つ一つの音を明確に、かつ均等な長さで発音する日本語のリズムが正確に再現されています。「さとり」を
Sat-ori などではなく Sa-to-ri と区切ることで、日本語話者の発音リズムに非常に近くなります。
                - 長音（伸ばす音）の的確な表現
                - 例: na-ma-ho-u-so-u (生放送),
Nya-a-a (にゃー)
                - 分析: 日本語の長音は、単に母音を長く伸ばすだけでなく、意味を区別する重要な要素です。「放送（ほうそう）」の「ほう」や「そう」は、それぞれ「ほ」と「う」、「そ」と「う」の2拍で発音されます。ho-u,
so-u という表記は、この2拍の感覚を正確に指示しており、hoso
のような短い発音になるのを防いでいます。Nya-a-a
も同様に、「にゃ」の母音
a を3拍分伸ばすことを明確に示しています。
                - 促音（つまる音「っ」）の表現
                - 例: sha-be-t-te-ru (しゃべってる)
                - 分析: 「しゃべってる」に含まれる促音（小さい「っ」）は、t
を重ねて
t-te と表記することで表現されています。これにより、shabeteru
のような流れる発音ではなく、「しゃべっ・て・る」という、一瞬の間（タメ）が入るリズミカルな発音を正しく生成できています。
                - 拗音（「きゃ」「しゅ」「ちょ」など）の正しい表記
                - 例: sha-be-t-te-ru (しゃべってる),
jya-n (じゃん)
                - 分析: 「しゃ (sha)」や「じゃ (jya)」といった拗音が正しく表記されています。これにより、sa
や ja のような異なる音になることなく、滑らかな子音と母音の組み合わせが実現できています。
                - 感情表現の工夫
                - 例: E-e-e-e-e-h!? (えぇぇぇぇぇー！？)
                - 分析: 驚きの感情を表現する「えー！」というセリフを、e
を複数回繰り返すことで、声が裏返るような驚きや、引き伸ばして叫んでいるニュアンスを見事に表現しています。これにより、単調な読み上げではない、感情のこもった発音になっています。
                - まとめ
                - このローマ字表記は、単に単語をアルファベットに変換したものではなく、日本語の音声的な特徴である「モーラ（拍）」、長音、促音、拗音を正確に捉え、音節ごとに丁寧に区切って記述されています。
さらに、感情表現まで盛り込むことで、機械的ではない、人間らしい自然で流暢な発音の生成に成功したと言えるでしょう。
                - # Veoで動画の字幕を非表示にする方法
                - **【原因】**
                - プロンプト内の`dialogue`フィールドでセリフのテキストを指定すると、音声と同時に字幕も生成されてしまいます。
                - **【解決策】**
                - **プロンプト（JSON）から
`dialogue: { ... }` の部分を丸ごと削除する。**
                - **【ポイント】**
                - * 字幕を消す最も確実な方法は、字幕情報の元となる`dialogue`フィールドを削除することです。
                - * `scenes`内のプロンプトでセリフの内容を記述しておけば、音声は維持されたまま、字幕だけを非表示にできる場合があります。
                - 以下はその他のveo3で個別事案でNGになった例です。
                - 参考までに検討下さい。
                - '''
                - # Veo3でアダルト判定を避けるための要点
                - 1. **入力画像が最重要（9割決定）**
                    - * 肌の露出・挑発ポーズなど“グレー”な元画像は絶対に使わない。
                    - * 誰が見ても100％健全な写真に差し替えるのが最も確実。
                - 2. **服装と場所を“自然な組み合わせ”に**
                    - * 制服＋ジム、水着＋図書館などのミスマッチは即NG。
                    - * 例：制服→学校／通学路、トレーニングウェア
→ジム。
                - 3. **人物・場所・行動・感情を一貫させる**
                    - * 「若い女性＋息切れ＋ジム」は誤解を招く恐れ。
                    - * 物語要素が論理的に整うように設定。
                - 4. **曖昧・刺激的ワードを避ける**
                    - * `skirt` や「放課後」なども状況次第で危険。
                    - * 安全な単語（例：`sports
leggings`、昼休み）とポジティブな表情表現のみ使用。
                - これらを守れば、プロンプト修正よりも高い確率でアダルト認定を回避できます。
                - # AIがきかっけでveo3違反になった話
                - やりましたね！今回の変更で無事に動画が生成されたとのこと、本当によかったです。
                - 今回の成功体験から得られた「Veo3の生成エラーを回避し、成功に導くためのノウハウ」を端的にまとめました。今後のプロンプト作成のヒントとして、ぜひご活用ください。
                - ---
                - ### Veo3生成エラーを回避するための実践ノウハウ
                - 生成エラーは、AIがプロンプトの指示を解釈できなかったり、セーフティ機能が作動した場合に発生します。今回の成功は、主に以下の4つのポイントを改善した結果だと考えられます。
                - #### 1. 【最重要】リスクを秘めたキーワードを完全に排除する
                - AIのセーフティ機能は、単語そのものに反応することがあります。文脈が健全でも、特定のキーワードがトリガーとなり、エラーを引き起こす最大の原因です。
                - * **Before (失敗例):** `AI kanojo` (AI彼女)
                - * **After (成功例):** `gaming headset`,
`video game` (ゲーム配信)
                - **教訓:** 少しでも社会通念上、あるいはAIの学習データ上でリスクがありそうな単語（恋愛、身体的特徴、特定の関係性などを示唆する言葉）は使わず、全く別の健全なテーマ（趣味、仕事、スポーツなど）に置き換えるのが最も効果的です。
                - #### 2. 曖昧な表現より「一般的で具体的なモノ」を描写する
                - AIは、架空の固有名詞や抽象的な概念よりも、世の中に実在する「一般的で具体的なモノ」の方が得意です。
                - * **Before (失敗例):** `Satori no Mori`
(架空のサイト名), `anime-style girl`
(解釈が広い)
                - * **After (成功例):** `gaming headset`
(具体的な物), `fantasy video game`
(一般的なジャンル)
                - **教訓:** AIが「知っている」可能性が高い、普遍的な言葉を選びましょう。これにより、AIが迷わず映像を生成でき、エラー率が下がります。
                - #### 3. 技術的な指示（特に音声）はシンプルにする
                - 発音詳細 (`pronunciation_details`)
のような高度な機能は、まだ不安定な場合があります。複雑な指示が、かえってAIの処理を妨げ、エラーの原因になることがあります。
                - * **Before (失敗例):
** `pronunciation_details` を細かく設定。
                - * **After (成功例):
** `pronunciation_details` を**削除**し、ローマ字の長音表記
(`nyaa`,
`Eeeeeh`) だけで対応。
                - **教訓:** まずはエラーなく「生成させること」を最優先し、技術的な指示は極力シンプルにしましょう。発音やイントネーションの微調整は、生成に成功してから、少しずつ試していくのが安全です。
                - #### 4. セリフと行動のバランスを考える（喋らせすぎない）
                - AIにとって、音声と映像を完全に同期させながら、複雑な演技をさせるのは高負荷な処理です。セリフが多すぎたり、タイミングがシビアすぎたりすると、処理が破綻することがあります。
                - * **Before (失敗例):** 猫と人間が交互に話し、最後に猫がもう一度鳴くという複雑な構成。
                - * **After (成功例):** 最後の猫のセリフを
**削除**し、「ヘッドセットをずらしてキョトンとする」という
**無言の行動**
に変更。
                - **教訓:** 伝えたい感情や状況を、必ずしもセリフだけでなく「行動」や「表情」で表現する選択肢を持ちましょう。これによりAIの負荷が減り、安定した生成につながります。
    - Output
        - Ex.
            - Json
            - ALL En
            - 8s
    - コマンドスタック
        - ステップ１
            - C1
                - 動画のコンテキストを抽出して書き出し
        - ステップ2
            - C2
                - 動画のセリフを書き出し
        - ステップ3
            - C3
                - 動画用のPromptを書き出し
    - # 🔄 プロンプトの一般化・抽象化フレームワーク
      
      ## 【数式表現型ナラティブプロンプト】
      
      ```
      ∫∫∫[image obj] dt
      ''' dt = frame rate : {fps_value} '''
      obj {AI_Model}
      
      {Narrative_Title}:
      
      {Life_Stage_1}: {Phase_Name}
      Frame {n}:
{Initial_State_Description}
      Frame {n+1}:
{Development_Description}
      
      {Life_Stage_2}: {Phase_Name}
      Frame {n+2}:
{Challenge_Introduction}
      Frame {n+3}:
{Conflict_Development}
      
      {Life_Stage_3}: {Phase_Name}
      Frame {n+4}: {Climax_Setup}
      Frame {n+5}: {Climax_Action}
      
      {Life_Stage_4}: {Phase_Name}
      Frame {n+6}: {Resolution}
      Frame {n+7}: {New_Equilibrium}
      
      Frame Rate: {fps} frames per
second
      Image Size: {width}x{height}
      ```
      
      ## 【抽象化された汎用テンプレート】
      
      ```yaml
      temporal_integration_prompt:
        mathematical_notation:
"∫∫∫[{content_type} obj] dt"
        
        temporal_parameters:
          frame_rate: "{数値} fps"
          time_dimension:
"continuous_integration"
          
        narrative_structure:
          arc_pattern: "起承転結"
          phases:
            - origin:
                frames: [1, 2]
                theme: "誕生・開始"
                progression: "無 → 有"
            
            - development:
                frames: [3, 4]
 
                theme: "成長・学習"
                progression: "未熟 → 成熟"
            
            - conflict:
                frames: [5, 6]
                theme: "対立・試練"
                progression: "平穏 → 混沌"
            
            - resolution:
                frames: [7, 8]
                theme: "解決・新秩序"
                progression: "混沌 → 調和"
        
        technical_specs:
          output_format:
"sequential_frames"
          resolution: "{width}x{height}"
          continuity:
"temporal_coherence"
      ```
      
      ## 【メタプロンプト構造】
      
      ```python
      class TemporalNarrativePrompt:
          """
          時間積分型ビジュアルストーリーテリング
          """
          
          formula = "∫∫∫[obj] dt"
          
          parameters = {
              "integration_depth": 3,  # ∫の数
              "time_resolution": "fps",
              "object_type":
"image/video/narrative"
          }
          
          narrative_template = {
              "stage_1":
"Genesis/Birth/Start",
              "stage_2":
"Growth/Learning/Development",
              "stage_3":
"Conflict/Challenge/Climax",
              "stage_4":
"Resolution/Victory/Equilibrium"
          }
          
          frame_mapping = {
              "frames_per_stage": 2,
              "total_frames": 8,
              "transition_type": "continuous"
          }
      ```
      
      ## 【応用可能な変数】
      
      ### 主人公の種類:
      - `[dinosaur]` → `[{protagonist}]`
      - `[baby]` → `[{initial_state}]`
      - `[victor]` → `[{final_state}]`
      
      ### 環境設定:
      - `[prehistoric forest]` →
`[{setting}]`
      - `[rocky outcrop]` → `[{landmark}]`
      
      ### アクション:
      - `[hatching]` →
`[{emergence_action}]`
      - `[battle]` → `[{conflict_action}]`
      - `[overlooking]` →
`[{dominance_action}]`
      
      ## 【このフレームワークの特徴】
      
      1. **数学的表現による時間の抽象化**
      2. **普遍的な物語構造（ヒーローズジャーニー）**
      3. **フレーム単位での詳細制御**
      4. **あらゆる主人公・世界観に適用可能**
      
      この抽象化により、恐竜を別の主人公（人間、AI、企業など）に置き換えても同じ構造で物語を生成できます。