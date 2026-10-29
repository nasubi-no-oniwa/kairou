// =============================================
//  ことば（日本語・English・繁體中文・한국어）
//  ===========================================

(function () {
  var LANGS = ['ja', 'en', 'zh', 'ko'];
  var KEY = 'kairou-lang';
  var D = {
 "lang_label": [
  "ことば",
  "Language",
  "語言",
  "언어"
 ],
 "home": [
  "なすびのお庭へ",
  "Nasubi's Garden (more games)",
  "前往茄子的庭院",
  "가지의 정원으로"
 ],
 "howto": [
  "あそびかた",
  "How to play",
  "玩法",
  "플레이 방법"
 ],
 "close": [
  "とじる",
  "Close",
  "關閉",
  "닫기"
 ],
 "back": [
  "もどる",
  "Back",
  "返回",
  "돌아가기"
 ],
 "to_title": [
  "タイトルへ",
  "Back to title",
  "回到標題",
  "타이틀로"
 ],
 "again": [
  "もう一回",
  "Play again",
  "再來一局",
  "한 판 더"
 ],
 "easy": [
  "よわい",
  "Easy",
  "簡單",
  "약함"
 ],
 "normal": [
  "ふつう",
  "Normal",
  "普通",
  "보통"
 ],
 "hard": [
  "つよい",
  "Hard",
  "困難",
  "강함"
 ],
 "vs_cpu": [
  "CPUとたいせん",
  "VS CPU",
  "對戰CPU",
  "CPU와 대전"
 ],
 "online": [
  "あいことばで対戦",
  "Play with a passcode",
  "用暗號對戰",
  "암호로 대전"
 ],
 "passcode": [
  "あいことば",
  "Passcode",
  "暗號",
  "암호"
 ],
 "name": [
  "なまえ",
  "Name",
  "名字",
  "이름"
 ],
 "noname": [
  "ななし",
  "Anonymous",
  "無名氏",
  "익명"
 ],
 "online_hint": [
  "同じあいことばを入れた人と対戦。3人目からは観戦になります。",
  "Play against whoever enters the same passcode. From the 3rd person on, you watch.",
  "和輸入相同暗號的人對戰。第3個人開始為觀戰。",
  "같은 암호를 입력한 사람과 대전. 3번째 사람부터는 관전이 됩니다."
 ],
 "join": [
  "はいる",
  "Join",
  "進入",
  "입장"
 ],
 "wait_pre": [
  "あいことば「",
  "Passcode: ",
  "暗號「",
  "암호 「"
 ],
 "wait_post": [
  "」",
  "",
  "」",
  "」"
 ],
 "waiting": [
  "あいてを待っています…",
  "Waiting for an opponent…",
  "等待對手中…",
  "상대를 기다리는 중…"
 ],
 "copy_link": [
  "さそうリンクをコピー",
  "Copy invite link",
  "複製邀請連結",
  "초대 링크 복사"
 ],
 "copied": [
  "コピーしました！",
  "Copied!",
  "已複製！",
  "복사했어요!"
 ],
 "send_link": [
  "このリンクを送ってください",
  "Send this link",
  "請傳送這個連結",
  "이 링크를 보내 주세요"
 ],
 "err_code": [
  "あいことばを入れてください（. # $ / [ ] は使えません）",
  "Enter a passcode (. # $ / [ ] are not allowed)",
  "請輸入暗號（不能使用 . # $ / [ ]）",
  "암호를 입력해 주세요 (. # $ / [ ] 는 사용할 수 없어요)"
 ],
 "err_code_short": [
  "あいことばを入れてください",
  "Enter a passcode",
  "請輸入暗號",
  "암호를 입력해 주세요"
 ],
 "connecting": [
  "つないでいます…",
  "Connecting…",
  "連線中…",
  "연결 중…"
 ],
 "err_net": [
  "通信できませんでした。電波のよいところでもう一度ためしてください",
  "Couldn't connect. Please try again where the signal is better.",
  "無法連線。請在訊號好的地方再試一次。",
  "연결하지 못했어요. 신호가 좋은 곳에서 다시 시도해 주세요."
 ],
 "err_notready": [
  "オンライン対戦はまだ準備中です",
  "Online play isn't ready yet",
  "線上對戰還在準備中",
  "온라인 대전은 아직 준비 중이에요"
 ],
 "err_conn": [
  "つながりませんでした",
  "Couldn't connect",
  "無法連線",
  "연결되지 않았어요"
 ],
 "left_win": [
  "相手が抜けたので、あなたの勝ち！",
  "Your opponent left, so you win!",
  "對手離開了，你贏了！",
  "상대가 나가서 당신의 승리!"
 ],
 "left": [
  "あいてが退室しました",
  "Your opponent left",
  "對手已離開",
  "상대가 퇴장했어요"
 ],
 "watch_in": [
  "観戦で入りました。試合が始まるのを待っています…",
  "You joined as a spectator. Waiting for the game to start…",
  "已用觀戰身分進入。等待比賽開始…",
  "관전으로 입장했어요. 경기 시작을 기다리는 중…"
 ],
 "wait_next": [
  "次の試合が始まるのを待っています…",
  "Waiting for the next game…",
  "等待下一局開始…",
  "다음 경기를 기다리는 중…"
 ],
 "wait_rematch": [
  "あいての「もう一回」を待っています…",
  "Waiting for your opponent to choose \"Play again\"…",
  "等待對手按「再來一局」…",
  "상대의 '한 판 더'를 기다리는 중…"
 ],
 "you": [
  "あなた",
  "You",
  "你",
  "나"
 ],
 "cpu": [
  "CPU",
  "CPU",
  "CPU",
  "CPU"
 ],
 "your_turn": [
  "あなたの番",
  "Your turn",
  "輪到你",
  "내 차례"
 ],
 "cpu_wait_label": [
  "CPU（ふつう）と遊びながら待つ",
  "Play the CPU (Normal) while waiting",
  "一邊和CPU（普通）玩一邊等",
  "기다리는 동안 CPU(보통)와 플레이"
 ],
 "qm_btn": [
  "だれかと対戦",
  "Play someone online",
  "隨機對戰",
  "아무나와 대전"
 ],
 "qm_stat": [
  "対戦待ち <b>{w}</b>人・対戦中 <b>{p}</b>組",
  "<b>{w}</b> waiting · <b>{p}</b> playing",
  "等待中 <b>{w}</b>人・對戰中 <b>{p}</b>組",
  "대기 <b>{w}</b>명 · 대전 중 <b>{p}</b>쌍"
 ],
 "qm_prime_hot": [
  "🔥 いま対戦タイム！（22時まで）",
  "🔥 Battle time now! (until 22:00 JST)",
  "🔥 現在是對戰時間！（到日本時間22點）",
  "🔥 지금은 대전 타임! (일본 시간 22시까지)"
 ],
 "qm_prime": [
  "🌙 毎晩21時〜22時は対戦タイム",
  "🌙 Battle time every night 21:00–22:00 JST",
  "🌙 每晚日本時間21〜22點是對戰時間",
  "🌙 매일 밤 일본 시간 21~22시는 대전 타임"
 ],
 "qm_sub": [
  "いま待っている人と、自動でつながります。",
  "You'll be matched automatically with someone who's waiting.",
  "自動和正在等待的人配對。",
  "기다리고 있는 사람과 자동으로 연결돼요."
 ],
 "qm_go": [
  "さがす",
  "Find a match",
  "尋找",
  "찾기"
 ],
 "qm_badname": [
  "その名前は使えません。ほかの名前にしてね",
  "That name can't be used. Please choose another.",
  "這個名字不能使用，請換一個。",
  "그 이름은 사용할 수 없어요. 다른 이름으로 해 주세요."
 ],
 "qm_searching": [
  "相手をさがしています",
  "Looking for an opponent",
  "正在尋找對手",
  "상대를 찾는 중"
 ],
 "qm_wait_pre": [
  "いま対戦待ち ",
  "Waiting now: ",
  "目前等待中 ",
  "현재 대기 "
 ],
 "qm_wait_post": [
  "人",
  "",
  "人",
  "명"
 ],
 "qm_cpu": [
  "CPUと遊びながら待つ",
  "Play the CPU while waiting",
  "一邊和CPU玩一邊等",
  "기다리는 동안 CPU와 플레이"
 ],
 "qm_cancel": [
  "やめる",
  "Cancel",
  "取消",
  "그만두기"
 ],
 "qm_retry": [
  "もう一度さがす",
  "Search again",
  "再找一次",
  "다시 찾기"
 ],
 "qm_searching_t": [
  "相手をさがしています… {t}",
  "Looking for an opponent… {t}",
  "正在尋找對手… {t}",
  "상대를 찾는 중… {t}"
 ],
 "qm_calling": [
  "CPUと遊んでいる人に声をかけています…",
  "Inviting someone who is playing the CPU…",
  "正在邀請正在和CPU玩的人…",
  "CPU와 플레이 중인 사람에게 신청하는 중…"
 ],
 "qm_declined": [
  "相手が見送りました。ほかの人をさがします",
  "They passed. Looking for someone else.",
  "對方跳過了，改找其他人。",
  "상대가 넘겼어요. 다른 사람을 찾을게요."
 ],
 "qm_found": [
  "相手が見つかりました！",
  "Opponent found!",
  "找到對手了！",
  "상대를 찾았어요!"
 ],
 "qm_avail": [
  "対戦できる相手がいます！",
  "Someone is ready to play!",
  "有可以對戰的對手！",
  "대전할 수 있는 상대가 있어요!"
 ],
 "qm_play": [
  "対戦する",
  "Play",
  "對戰",
  "대전하기"
 ],
 "qm_pass": [
  "見送る",
  "Pass",
  "跳過",
  "넘기기"
 ],
 "qm_taken": [
  "さっきの相手は、ほかの人と対戦を始めました。もう少し待ってね",
  "That player started a match with someone else. Please wait a little longer.",
  "剛才的對手已經和別人開始對戰了。請再等一下。",
  "방금 상대는 다른 사람과 대전을 시작했어요. 조금만 더 기다려 주세요."
 ],
 "qm_fail": [
  "相手とつながりませんでした（{c}）",
  "Couldn't connect to your opponent ({c})",
  "無法和對手連線（{c}）",
  "상대와 연결되지 않았어요 ({c})"
 ],
 "qm_nojoin": [
  "入れませんでした",
  "Couldn't join",
  "無法進入",
  "들어가지 못했어요"
 ],
 "qm_next": [
  "次の相手をさがす",
  "Find next opponent",
  "尋找下一位對手",
  "다음 상대 찾기"
 ],
 "doc_title": [
  "回廊快走（かいろうかいそう）",
  "Corridor Dash",
  "迴廊快跑",
  "회랑 질주"
 ],
 "doc_desc": [
  "通路をまわして、どこまでも走れ。壁も天井も床になる、無限に続く回廊を走るゲーム。",
  "Spin the corridor and keep running. Walls and ceiling become the floor in this endless corridor runner.",
  "轉動通道，一直跑下去。牆壁和天花板都能變成地板的無限迴廊跑酷遊戲。",
  "통로를 돌려서 끝없이 달려라. 벽도 천장도 바닥이 되는 무한 회랑 러닝 게임."
 ],
 "kana": [
  "かいろうかいそう",
  "KAIROU KAISOU",
  "KAIROU KAISOU",
  "KAIROU KAISOU"
 ],
 "logo": [
  "回廊<span>快走</span>",
  "CORRIDOR<span>DASH</span>",
  "迴廊<span>快跑</span>",
  "회랑<span>질주</span>"
 ],
 "tag": [
  "通路をまわして、どこまでも走れ。",
  "Spin the corridor. Run forever.",
  "轉動通道，一直跑下去。",
  "통로를 돌려서, 끝없이 달려라."
 ],
 "start": [
  "無限回廊を走る",
  "Run the endless corridor",
  "奔跑無限迴廊",
  "무한 회랑 달리기"
 ],
 "ghost_btn": [
  "ベストのコースで、ゴーストと走る",
  "Race your ghost on your best course",
  "在最佳路線上和幽靈賽跑",
  "베스트 코스에서 고스트와 달리기"
 ],
 "phone": [
  "スマホ",
  "Phone",
  "手機",
  "스마트폰"
 ],
 "phone_d": [
  "画面の<b>左半分</b>：指を左右にすべらせて横に動く<br>画面の<b>右半分</b>：左右にスワイプで通路が90度まわる<br>右下の<b>ジャンプ</b>ボタンでジャンプ",
  "<b>Left half</b>: slide your finger left/right to move<br><b>Right half</b>: swipe left/right to spin the corridor 90°<br>Tap <b>JUMP</b> at the bottom right to jump",
  "畫面<b>左半邊</b>：手指左右滑動來橫向移動<br>畫面<b>右半邊</b>：左右滑動讓通道轉90度<br>按右下的<b>跳</b>按鈕跳躍",
  "화면 <b>왼쪽 절반</b>: 손가락을 좌우로 밀어 옆으로 이동<br>화면 <b>오른쪽 절반</b>: 좌우로 스와이프하면 통로가 90도 회전<br>오른쪽 아래 <b>점프</b> 버튼으로 점프"
 ],
 "pc_d": [
  "← → で横に動く　スペースでジャンプ<br>Q・E（または A・D）で通路をまわす",
  "← → to move · Space to jump<br>Q / E (or A / D) to spin the corridor",
  "← → 橫向移動　空白鍵跳躍<br>Q・E（或 A・D）轉動通道",
  "← → 로 이동 · 스페이스로 점프<br>Q·E (또는 A·D)로 통로 회전"
 ],
 "vs_d": [
  "2人が同じコースを同時に走る。先にやられたら、相手に<b>30秒のボーナスタイム</b>（コインがたくさん）。最後のスコア（距離＋コイン）が多い方の勝ち。",
  "Two players run the same course at the same time. Whoever goes down first gives the other a <b>30-second bonus time</b> (lots of coins). Highest final score (distance + coins) wins.",
  "2人同時跑同一條路線。先出局的話，對手會得到<b>30秒獎勵時間</b>（很多金幣）。最後分數（距離＋金幣）高的人獲勝。",
  "2명이 같은 코스를 동시에 달린다. 먼저 쓰러지면 상대에게 <b>30초 보너스 타임</b>(코인 잔뜩). 최종 점수(거리+코인)가 높은 쪽이 승리."
 ],
 "note": [
  "床に穴があったら、まわして壁を床にしよう。赤い低い箱はジャンプでこえられる。紫と緑の高いかべはよけるしかない。ひびの入った床は近づくとくずれる。黄色の矢印はジャンプ台。<br>コインは1枚1mとして、最後に記録に足されます。",
  "Hole in the floor? Spin so a wall becomes the floor. Jump over low red boxes. Dodge tall purple and green walls. Cracked floors crumble as you get close. Yellow arrows are jump pads.<br>Each coin counts as 1m and is added to your record at the end.",
  "地板有洞的話，就轉動通道讓牆壁變成地板。紅色矮箱可以跳過去。紫色和綠色的高牆只能閃開。有裂痕的地板靠近就會崩塌。黃色箭頭是跳台。<br>金幣1枚算1m，最後加進紀錄。",
  "바닥에 구멍이 있으면 돌려서 벽을 바닥으로 만들자. 빨간 낮은 상자는 점프로 넘을 수 있다. 보라색·초록색 높은 벽은 피할 수밖에 없다. 금 간 바닥은 다가가면 무너진다. 노란 화살표는 점프대.<br>코인은 1개당 1m로 마지막에 기록에 더해진다."
 ],
 "home_e": [
  "🍆 なすびのお庭へ",
  "🍆 Nasubi's Garden (more games)",
  "🍆 前往茄子的庭院",
  "🍆 가지의 정원으로"
 ],
 "jump": [
  "ジャンプ",
  "JUMP",
  "跳",
  "점프"
 ],
 "hint_l": [
  "← すべらせて横移動 →",
  "← slide to move →",
  "← 滑動橫移 →",
  "← 밀어서 이동 →"
 ],
 "hint_r": [
  "⇆ スワイプで回転",
  "⇆ swipe to spin",
  "⇆ 滑動來旋轉",
  "⇆ 스와이프로 회전"
 ],
 "fell": [
  "ドボン！",
  "FELL!",
  "掉下去了！",
  "풍덩!"
 ],
 "bonk": [
  "ゴツン！",
  "BONK!",
  "撞到了！",
  "쾅!"
 ],
 "b_dist": [
  "走った距離",
  "Distance",
  "跑的距離",
  "달린 거리"
 ],
 "b_coin": [
  "コイン",
  "Coins",
  "金幣",
  "코인"
 ],
 "b_mis": [
  "ミッション",
  "Missions",
  "任務",
  "미션"
 ],
 "b_mis_u": [
  "こ",
  "",
  "個",
  "개"
 ],
 "record": [
  "きろく",
  "Record",
  "紀錄",
  "기록"
 ],
 "ex_code": [
  "例：かいろう123",
  "e.g. kairou123",
  "例：kairou123",
  "예: kairou123"
 ],
 "online_hint2": [
  "同じあいことばを入れた人と対戦します（2人まで）。",
  "Play against whoever enters the same passcode (2 players max).",
  "和輸入相同暗號的人對戰（最多2人）。",
  "같은 암호를 입력한 사람과 대전해요 (2명까지)."
 ],
 "wait_bonus": [
  "相手のボーナスタイムが終わるまで待っています",
  "Waiting for your opponent's bonus time to end",
  "等待對手的獎勵時間結束",
  "상대의 보너스 타임이 끝날 때까지 기다리는 중"
 ],
 "opp": [
  "あいて",
  "Opponent",
  "對手",
  "상대"
 ],
 "you_sfx": [
  "（あなた）",
  " (you)",
  "（你）",
  " (나)"
 ],
 "left_n": [
  "のこり {n}秒くらい",
  "About {n}s left",
  "剩大約 {n} 秒",
  "약 {n}초 남음"
 ],
 "left_30": [
  "のこり 30秒",
  "30s left",
  "剩 30 秒",
  "30초 남음"
 ],
 "res_win": [
  "かち！",
  "YOU WIN!",
  "贏了！",
  "승리!"
 ],
 "res_lose": [
  "まけ…",
  "You lose…",
  "輸了…",
  "패배…"
 ],
 "res_draw": [
  "ひきわけ",
  "Draw",
  "平手",
  "무승부"
 ],
 "score": [
  "スコア",
  "Score",
  "分數",
  "점수"
 ],
 "vs_best": [
  "VSゴースト {n}m",
  "VS Ghost {n}m",
  "VS幽靈 {n}m",
  "VS 고스트 {n}m"
 ],
 "best_n": [
  "ベスト {n}m",
  "Best {n}m",
  "最佳 {n}m",
  "베스트 {n}m"
 ],
 "last_n": [
  "前回 {n}m",
  "Last {n}m",
  "上次 {n}m",
  "지난번 {n}m"
 ],
 "best": [
  "ベスト",
  "Best",
  "最佳",
  "베스트"
 ],
 "mis_done": [
  "ミッション達成！ +{n}m",
  "Mission complete! +{n}m",
  "任務達成！ +{n}m",
  "미션 달성! +{n}m"
 ],
 "area_reached": [
  "たどりついた区間：{a}",
  "Reached: {a}",
  "抵達的區間：{a}",
  "도달한 구간: {a}"
 ],
 "lap": [
  "（{n}周目）",
  " (lap {n})",
  "（第{n}圈）",
  " ({n}바퀴째)"
 ],
 "ghost_beat": [
  "ゴーストに勝った！ 自己ベスト更新！",
  "You beat your ghost! New personal best!",
  "贏過幽靈了！刷新個人最佳！",
  "고스트를 이겼다! 자기 최고 기록 갱신!"
 ],
 "new_best": [
  "自己ベスト更新！",
  "New personal best!",
  "刷新個人最佳！",
  "자기 최고 기록 갱신!"
 ],
 "room_full": [
  "この部屋は満員です（2人まで）。ちがうあいことばにしてください",
  "This room is full (2 players max). Please use a different passcode.",
  "這個房間已滿（最多2人）。請換一個暗號。",
  "이 방은 꽉 찼어요 (2명까지). 다른 암호로 해 주세요."
 ],
 "score_rule": [
  "スコア＝距離＋コイン",
  "Score = distance + coins",
  "分數＝距離＋金幣",
  "점수 = 거리 + 코인"
 ],
 "st_left": [
  "（退室）",
  " (left)",
  "（離開）",
  " (퇴장)"
 ],
 "st_goal": [
  "（ゴール）",
  " (finished)",
  "（完成）",
  " (완주)"
 ],
 "st_over": [
  "（おわり）",
  " (out)",
  "（結束）",
  " (끝)"
 ],
 "opp_left_bonus": [
  "相手が退室！ ボーナスタイム",
  "Opponent left! Bonus time",
  "對手離開了！獎勵時間",
  "상대 퇴장! 보너스 타임"
 ],
 "opp_down_bonus": [
  "相手がやられた！ ボーナスタイム",
  "Opponent is down! Bonus time",
  "對手出局了！獎勵時間",
  "상대가 쓰러졌다! 보너스 타임"
 ],
 "bonus_left": [
  "ボーナスタイム のこり {n}秒",
  "Bonus time: {n}s left",
  "獎勵時間 剩 {n} 秒",
  "보너스 타임 {n}초 남음"
 ],
 "finish": [
  "フィニッシュ！",
  "FINISH!",
  "完成！",
  "피니시!"
 ],
 "solo_wait": [
  "1人で走りながら待つ",
  "Run solo while waiting",
  "一邊自己跑一邊等",
  "기다리는 동안 혼자 달리기"
 ],
 "th0": [
  "はじまりの回廊",
  "Starting Corridor",
  "起點迴廊",
  "시작의 회랑"
 ],
 "th1": [
  "さくらの回廊",
  "Cherry Blossom Corridor",
  "櫻花迴廊",
  "벚꽃 회랑"
 ],
 "th2": [
  "うみの回廊",
  "Ocean Corridor",
  "大海迴廊",
  "바다 회랑"
 ],
 "th3": [
  "ゆうやけの回廊",
  "Sunset Corridor",
  "夕陽迴廊",
  "노을 회랑"
 ],
 "th4": [
  "もりの回廊",
  "Forest Corridor",
  "森林迴廊",
  "숲 회랑"
 ],
 "th5": [
  "こおりの回廊",
  "Ice Corridor",
  "冰之迴廊",
  "얼음 회랑"
 ],
 "th6": [
  "よるの回廊",
  "Night Corridor",
  "夜晚迴廊",
  "밤의 회랑"
 ],
 "th7": [
  "おかしの回廊",
  "Candy Corridor",
  "甜點迴廊",
  "과자 회랑"
 ],
 "m_c15": [
  "コインを15枚",
  "15 coins",
  "拿15枚金幣",
  "코인 15개"
 ],
 "m_c30": [
  "コインを30枚",
  "30 coins",
  "拿30枚金幣",
  "코인 30개"
 ],
 "m_r20": [
  "20回まわす",
  "Spin ×20",
  "轉20次",
  "20번 회전"
 ],
 "m_r50": [
  "50回まわす",
  "Spin ×50",
  "轉50次",
  "50번 회전"
 ],
 "m_j30": [
  "ジャンプ30回",
  "Jump ×30",
  "跳30次",
  "점프 30번"
 ],
 "m_p5": [
  "ジャンプ台で5回とぶ",
  "5 jump pads",
  "用跳台跳5次",
  "점프대로 5번 날기"
 ],
 "m_mv10": [
  "動くかべを10回ぬける",
  "Pass 10 moving walls",
  "穿過10次移動牆",
  "움직이는 벽 10번 통과"
 ],
 "m_d300": [
  "300m走る",
  "Run 300m",
  "跑300m",
  "300m 달리기"
 ],
 "m_a1": [
  "1区間をこえる",
  "Clear a section",
  "跑過1個區間",
  "1구간 넘기"
 ],
 "m_nr150": [
  "まわさずに150m",
  "150m no spin",
  "不轉跑150m",
  "회전 없이 150m"
 ],
 "stg0": [
  "はこ",
  "Boxes",
  "箱子",
  "상자"
 ],
 "stg1": [
  "あな",
  "Holes",
  "洞",
  "구멍"
 ],
 "stg2": [
  "じぐざぐ",
  "Zigzag",
  "之字形",
  "지그재그"
 ],
 "stg3": [
  "かべへ",
  "To the wall",
  "走牆壁",
  "벽으로"
 ],
 "stg4": [
  "まんなか",
  "Middle",
  "正中間",
  "한가운데"
 ],
 "stg5": [
  "はしっこ",
  "Edges",
  "邊邊",
  "가장자리"
 ],
 "stg6": [
  "はこジャンプ",
  "Box jumps",
  "跳箱子",
  "상자 점프"
 ],
 "stg7": [
  "みぎかひだり",
  "Right or left",
  "右還是左",
  "오른쪽이냐 왼쪽이냐"
 ],
 "stg8": [
  "てんじょう",
  "Ceiling",
  "天花板",
  "천장"
 ],
 "stg9": [
  "いったりきたり",
  "Back and forth",
  "來來回回",
  "왔다 갔다"
 ],
 "stg10": [
  "ほそみち",
  "Narrow path",
  "窄路",
  "좁은 길"
 ],
 "stg11": [
  "かべでとぶ",
  "Wall jumps",
  "在牆上跳",
  "벽에서 점프"
 ],
 "stg12": [
  "はこのかべ",
  "Box wall",
  "箱子牆",
  "상자 벽"
 ],
 "stg13": [
  "てんじょうのはこ",
  "Ceiling boxes",
  "天花板的箱子",
  "천장의 상자"
 ],
 "stg14": [
  "はやいじぐざぐ",
  "Fast zigzag",
  "快速之字形",
  "빠른 지그재그"
 ],
 "stg15": [
  "ぐるぐる",
  "Round and round",
  "轉圈圈",
  "빙글빙글"
 ],
 "stg16": [
  "ジャンプれんぞく",
  "Jump combo",
  "連續跳",
  "연속 점프"
 ],
 "stg17": [
  "どこもあぶない",
  "Danger everywhere",
  "到處都危險",
  "어디나 위험"
 ],
 "stg18": [
  "ひとすじ",
  "Single lane",
  "一條路",
  "외길"
 ],
 "stg19": [
  "あなとはこ",
  "Holes & boxes",
  "洞和箱子",
  "구멍과 상자"
 ],
 "stg20": [
  "うごくかべ",
  "Moving wall",
  "移動牆",
  "움직이는 벽"
 ],
 "stg21": [
  "うごくかべ２まい",
  "Two moving walls",
  "兩道移動牆",
  "움직이는 벽 2장"
 ],
 "stg22": [
  "かべのあいだ",
  "Between walls",
  "牆壁之間",
  "벽 사이"
 ],
 "stg23": [
  "うごくかべとあな",
  "Moving walls & holes",
  "移動牆和洞",
  "움직이는 벽과 구멍"
 ],
 "stg24": [
  "ひびわれ",
  "Cracks",
  "裂痕",
  "금 간 바닥"
 ],
 "stg25": [
  "ジャンプだい",
  "Jump pads",
  "跳台",
  "점프대"
 ],
 "stg26": [
  "くずれるみち",
  "Crumbling path",
  "崩塌的路",
  "무너지는 길"
 ],
 "stg27": [
  "とんでまわる",
  "Fly and spin",
  "飛起來轉",
  "날아서 회전"
 ],
 "stg28": [
  "ジャンプだいれんぞく",
  "Jump pad combo",
  "連續跳台",
  "연속 점프대"
 ],
 "stg29": [
  "くずれるらせん",
  "Crumbling spiral",
  "崩塌螺旋",
  "무너지는 나선"
 ],
 "stg30": [
  "かべのあらし",
  "Wall storm",
  "牆壁風暴",
  "벽의 폭풍"
 ]
};
  function pick() {
    try { var q = new URLSearchParams(location.search).get('lang'); if (q && LANGS.indexOf(q) >= 0) { try { localStorage.setItem(KEY, q); } catch (e) {} return q; } } catch (e) {}
    try { var s = localStorage.getItem(KEY); if (s && LANGS.indexOf(s) >= 0) return s; } catch (e) {}
    var n = (navigator.language || 'ja').toLowerCase();
    if (n.indexOf('ja') === 0) return 'ja'; if (n.indexOf('ko') === 0) return 'ko'; if (n.indexOf('zh') === 0) return 'zh'; return 'en';
  }
  var L = pick();
  function t(k, v) {
    var row = D[k]; var i = LANGS.indexOf(L);
    var s = row ? (row[i] != null ? row[i] : row[0]) : k;
    if (v) for (var x in v) s = s.split('{' + x + '}').join(v[x]);
    return s;
  }
  function koFont() {
    if (L !== 'ko' || document.getElementById('ko-font')) return;
    var l = document.createElement('link'); l.id = 'ko-font'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap'; document.head.appendChild(l);
  }
  function apply() {
    koFont();
    var de = document.documentElement;
    de.lang = L === 'zh' ? 'zh-Hant' : L; de.setAttribute('data-lang', L);
    document.querySelectorAll('[data-i]').forEach(function (e) { e.textContent = t(e.dataset.i); });
    document.querySelectorAll('[data-ih]').forEach(function (e) { e.innerHTML = t(e.dataset.ih); });
    document.querySelectorAll('[data-ip]').forEach(function (e) { e.placeholder = t(e.dataset.ip); });
    document.querySelectorAll('[data-ia]').forEach(function (e) { e.setAttribute('aria-label', t(e.dataset.ia)); });
    document.querySelectorAll('.langs button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.lang === L ? 'true' : 'false'); });
    document.title = t('doc_title');
    var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', t('doc_desc'));
    try { document.dispatchEvent(new CustomEvent('langchange', { detail: L })); } catch (e) {}
  }
  function set(l) { if (LANGS.indexOf(l) < 0) return; L = l; try { localStorage.setItem(KEY, l); } catch (e) {} apply(); }
  function bind() {
    document.querySelectorAll('.langs button').forEach(function (b) { b.addEventListener('click', function () { set(b.dataset.lang); }); });
    apply();
  }
  window.I18N = { t: t, set: set, apply: apply, get lang() { return L; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();

window.I18N_STAGE = {"はこ": "stg0", "あな": "stg1", "じぐざぐ": "stg2", "かべへ": "stg3", "まんなか": "stg4", "はしっこ": "stg5", "はこジャンプ": "stg6", "みぎかひだり": "stg7", "てんじょう": "stg8", "いったりきたり": "stg9", "ほそみち": "stg10", "かべでとぶ": "stg11", "はこのかべ": "stg12", "てんじょうのはこ": "stg13", "はやいじぐざぐ": "stg14", "ぐるぐる": "stg15", "ジャンプれんぞく": "stg16", "どこもあぶない": "stg17", "ひとすじ": "stg18", "あなとはこ": "stg19", "うごくかべ": "stg20", "うごくかべ２まい": "stg21", "かべのあいだ": "stg22", "うごくかべとあな": "stg23", "ひびわれ": "stg24", "ジャンプだい": "stg25", "くずれるみち": "stg26", "とんでまわる": "stg27", "ジャンプだいれんぞく": "stg28", "くずれるらせん": "stg29", "かべのあらし": "stg30"};
