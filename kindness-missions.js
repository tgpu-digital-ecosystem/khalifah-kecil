/* Child-safe, fully local activity prompts. Not generative AI, no profiles or data collection. */
(()=>{'use strict';
const root=document.getElementById('khalifah-kindness');
if(!root)return;
const copy={
ms:{head:'Misi Adab & Kebaikan',intro:'Latihan kecil bersama ibu bapa atau guru. Pilih satu misi, cuba di dunia sebenar dan ceritakan apa yang dipelajari.',select:'Pilih misi',try:'Apa yang boleh dicuba?',reflect:'Soalan untuk berbincang',adult:'Minta bantuan orang dewasa',offline:'Letakkan telefon dahulu. Lakukan bersama orang dewasa; tiada foto, nama atau mesej yang perlu dihantar.',safe:'Pembantu ini hanya memilih cadangan yang sudah disemak dalam aplikasi. Tiada sembang AI terbuka, pemarkahan kanak-kanak atau perkongsian data.',activities:[
['Kata-kata baik','Sapa ahli keluarga dengan hormat dan ucap terima kasih apabila mereka membantu.','Bagaimana orang itu rasa apabila kamu bercakap dengan baik?'],
['Membantu di rumah','Tanya penjaga tugasan selamat yang boleh dibuat seperti menyusun buku atau mengemas meja.','Siapa yang menerima manfaat daripada bantuan kamu?'],
['Jujur & berani','Ceritakan satu situasi rekaan apabila seseorang tersilap. Bincang cara bercakap benar dengan baik.','Mengapa mengaku kesilapan boleh membantu kita belajar?'],
['Menjaga alam','Bersama penjaga, asingkan kertas bersih yang boleh digunakan semula.','Bagaimana tindakan kecil ini memberi manfaat kepada alam?']
]},
en:{head:'Good Manners & Kindness Missions',intro:'Small activities with a parent or teacher. Pick a mission, try it offline and discuss what you learned.',select:'Choose a mission',try:'Activity to try',reflect:'Conversation prompt',adult:'Ask a trusted adult to help',offline:'Put your device down. Work with a trusted adult; no photo, name or message needs to be sent.',safe:'This guide selects prewritten activities only. No open AI chat, child scoring or personal-data sharing.',activities:[
['Kind words','Greet a family member respectfully and say thank you when someone helps.','How might the other person feel when you speak kindly?'],
['Helping at home','Ask your caregiver for a safe task such as organising books or tidying a table.','Who benefits when you give a little help?'],
['Honesty and courage','Imagine a fictional story about making a mistake. Talk about how to tell the truth gently.','Why can admitting a mistake help us learn?'],
['Caring for nature','With a caregiver, collect clean paper that can be reused.','How can a small action help the environment?']
]},
ar:{head:'مهمات الأدب واللطف',intro:'أنشطة صغيرة مع ولي الأمر أو المعلّم. اختر مهمة وجرّبها بعيدًا عن الشاشة ثم ناقش ما تعلّمته.',select:'اختر المهمة',try:'نشاط للتجربة',reflect:'سؤال للنقاش',adult:'اطلب المساعدة من شخص بالغ موثوق',offline:'اترك الهاتف قليلًا. نفّذ النشاط مع شخص بالغ موثوق، ولا حاجة لإرسال صورة أو اسم أو رسالة.',safe:'يقترح هذا الدليل أنشطة معدّة مسبقًا فقط. لا دردشة مفتوحة بالذكاء الاصطناعي ولا تقييم للأطفال أو مشاركة بياناتهم.',activities:[
['الكلام الطيب','حيِّ فردًا من أسرتك بأدب واشكره عندما يقدم لك المساعدة.','كيف يشعر الآخر عندما تتحدث معه بلطف؟'],
['المساعدة في المنزل','اطلب من ولي أمرك عملًا آمنًا مثل ترتيب الكتب أو تنظيف الطاولة.','من ينتفع بمساعدتك؟'],
['الصدق والشجاعة','تخيل قصة عن شخص أخطأ وناقش طريقة قول الحقيقة بلطف.','لماذا يساعدنا الاعتراف بالخطأ على التعلم؟'],
['حماية الطبيعة','اجمع مع ولي أمرك بعض الورق النظيف الذي يمكن استخدامه مرة أخرى.','كيف ينفع هذا العمل البسيط البيئة؟']
]}
};
const language=document.createElement('select');language.id='kindness-language';language.setAttribute('aria-label','Activity language');
for(const [code,label] of [['ms','Bahasa Melayu'],['en','English'],['ar','العربية']]){const option=document.createElement('option');option.value=code;option.textContent=label;language.append(option)}
const choose=document.createElement('select');choose.id='kindness-choice';choose.setAttribute('aria-label','Kindness activity');
const title=document.createElement('h2'),intro=document.createElement('p'),pickLabel=document.createElement('label'),activityTitle=document.createElement('h3'),task=document.createElement('p'),questionTitle=document.createElement('h3'),question=document.createElement('p'),adult=document.createElement('p'),offline=document.createElement('p'),caution=document.createElement('p');
const helper=document.createElement('article');helper.className='kindness-content';helper.setAttribute('aria-live','polite');
helper.append(activityTitle,task,questionTitle,question,adult,offline);
root.append(title,intro,language,pickLabel,choose,helper,caution);
function update(){
 const t=copy[language.value]||copy.ms;
 title.textContent=t.head;intro.textContent=t.intro;pickLabel.textContent=t.select;pickLabel.htmlFor='kindness-choice';
 const old=Number(choose.value)||0;choose.replaceChildren();
 t.activities.forEach(([label],i)=>{const option=document.createElement('option');option.value=String(i);option.textContent=label;choose.append(option)});choose.value=String(old);
 activity();
 caution.textContent=t.safe;
 root.dir=language.value==='ar'?'rtl':'ltr';root.lang=language.value;
}
function activity(){
 const t=copy[language.value]||copy.ms;
 const item=t.activities[Number(choose.value)]||t.activities[0];
 activityTitle.textContent=t.try;task.textContent=item[1];questionTitle.textContent=t.reflect;question.textContent=item[2];
 adult.textContent=t.adult;offline.textContent=t.offline;
}
language.addEventListener('change',update);
choose.addEventListener('change',activity);
update();
})();
