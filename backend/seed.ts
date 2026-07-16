import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User, { Role } from './models/User';
import Activity from './models/Activity';

dotenv.config();

const volunteers2024Data = `
1	Aryan Jain	24BCE11080	aryan.24bce11080@vitbhopal.ac.in	8989189243
2	Harsh Bokade	24BCE10513	harsh.24bce10513@vitbhopal.ac.in	9424380482
3	Shruti Sharma 	24BAI10529	shruti.24bai10529@vitbhopal.ac.in	8085087801
4	Amish Chaturvedi	24BAI10192	amish.24bai10192@vitbhopal.ac.in	7610685495
5	Shristi Gupta	24BAS10070	shristi.24bas10070@vitbhopal.ac.in	7386272097
6	Tharani Saritha	24MIM10250	saritha.24mim10250@vitbhopal.ac.in	7386272097
7	Nityansh Dixit 	24BHI10032	nityansh.24bhi10032@vitbhopal.ac.in	9106429673
8	Soumya Mishra	24MIP10024	soumya.24mip10024@vitbhopal.ac.in	9301423560
9	Nandine Pandey	24BAI10446	nandine.24bai10446@vitbhopal.ac.in	7905404073
10	Mahak Chandrawanshi	24BCE11390	mahak.24bce11390@vitbhopal.ac.in	8269883666
11	Rose Raghuwanshi	24BCY10316	rose.24bcy10316@vitbhopal.ac.in	9826357559
12	Ayushi Shukla	24BCG10006	ayushi.24bcg10006@vitbhopal.ac.in	6306394916
13	Sampada Seth	24BAI10058	sampada.24bai10058@vitbhopal.ac.in	8839918508
14	Shagun Singh	24BCY10379	shagun.24bcy10379@vitbhopal.ac.in	8529843670
15	Kushagra Sharma 	24MEI10148	kushagra.24mei10148@vitbhopal.ac.in	9340549961
16	Shivi Sanjay	24BAI10054	shivi.24bai10054@vitbhopal.ac.in	9534128944
17	Shivam Satish Waghule	24BSA10126	shivam.24bsa10126@vitbhopal.ac.in	7276234332
18	Divyanka	24BAI10418	divyanka.24bai10418@vitbhopal.ac.in	7318304955
19	Kartavya Rana	24MIM10081	kartavya.24mim10081@vitbhopal.ac.in	8000429782
20	Om Sharma	24BCE10274	sharma.24bce10274@vitbhopal.ac.in	8839415564
21	Rhythm Sharma	24BCY10103	rhythm.24bcy10103@vitbhopal.ac.in	9637398915
22	Kashish Kale	24BSA10038	kashish.24bsa10038@vitbhopal.ac.in	9238305273
23	Kriti Chouhan	24BAS10104	kriti.24bas10104@vitbhopal.ac.in	9302549935
24	Pragati Kumari 	24BCE10433 	pragati.24bce10433@vitbhopal.ac.in	8002159268
25	Arpita 	24BSA10276	arpita.24bsa10276@vitbhopal.ac.in	7480959602
26	Ayush Singh Chandel 	24BCE11071	ayush.24bce11071@vitbhopal.ac.in	9453154897
27	Nikita Panda 	24bsa10003	nikita.24bsa10003@vitbhopal.ac.in	9630453553
28	Arpita	24bce11285	arpita.24bce11285@vitbhopal.ac.in	9534384627
29	chahat garg 	24bai10924	chahat.24bai10924@vitbhopal.ac.in	9463047403
30	Anushka Agarwal 	24BEY10052	anushka.24bey10052@vitbhopal.ac.in	9007704666
31	Susmit Roy	24MIM10037	susmit.24mim10037@vitbhopal.ac.in	787243486
32	Prateek Mishra	24BCY10072	prateek.24bcy10072@vitbhopal.ac.in	6355208514
33	Urvi Chadha	24BOE10047	urvi.24boe10047@vitbhopal.ac.in	9811777286
34	Shreya Rawat 	24bcy10333	shreya.24bcy10333@vitbhopal.ac.in	8826003911
35	Maulik Dubey	24BAI10764	maulik.24bai10764@vitbhopal.ac.in	9929662608
36	Sneha Rakundla	24BCE10718	sneha.24bce10718@vitbhopal.ac.in	8529721814
37	Dipika.k	24BHI10064	dipika.24bhi10064@vitbhopal.ac.in	8075127150
38	Kristi Roy 	24BHI10113 	kristi.24bhi10113@vitbhopal.ac.in	9933356006
39	Athrv Dixit	24BAI10037	athrv.24bai10037@vitbhopal.ac.in	9555379748
40	Jyoti Rana 	24BCE10439	jyoti.24bce10439@vitbhopal.ac.in	9050796088
41	Ria Singh 	24MIP10046	ria.24mip10046@vitbhopal.ac.in	9219598586
42	Anant Singh	24BAI10345	anant.24bai10345@vitbhopal.ac.in	8445560156
43	Ankush Kumar Maurya	24MIP10073	ankush.24mip10073@vitbhopal.ac.in	8303308210
44	Mitakshara Srivastava	24BEC10147	mitakshara.24bec10147@vitbhopal.ac.in	9170877798
45	Kshitika Atri 	24BSA10275	kshitika.24bsa10275@vitbhopal.ac.in	9691084503
46	Anushka Dubey 	24BEC10058 	anushka.24bec10058@vitbhopal.ac.in	9690986525
47	Aditya Tiwari 	24MIM10026	aditya.24mim10026@vitbhopal.ac.in	7307426755
48	Ameya shukla	24BAI10495	ameya.24bai10495@vitbhopal.ac.in	6391388737
49	Vaishnavi Tiwari 	24BCY10262	vaishnavi.24bcy10262@vitbhopal.ac.in	9520779464
50	Ayushi Gupta	24BEC10164	ayushi.24bec10164@vitbhopal.ac.in	7007455508
51	Shrishti Srivastava 	24BCY10214	shrishti.24bcy10214@vitbhopal.ac.in	9651383486
52	Nishtha Samdani	24BSA10226	nishtha.24bsa10226@vitbhopal.ac.in	9664407729
53	Prerana Tripathi 	24BAI10168	prerana.24bai10168@vitbhopal.ac.in	8467822571
54	J Shivya Rao	24BCY10203	shivya.24bcy10203@vitbhopal.ac.in	9098309689
55	Kashika Agrawal 	24BAI10372	kashika.24bai10372@vitbhopal.ac.in	9827510356
56	Soumya Chouhan	24MIP10170	soumya.24mip10170@vitbhopal.ac.in	8827953089
57	Anushree Soni 	24BCY10234	anushree.24bcy10234@vitbhopal.ac.in	9294515546
58	Aarya kishor Jadhav 	24BOE10013	aarya.24boe10013@vitbhopal.ac.in	8591285965
59	Diya Gugale 	24BAI10870	diya.24bai10870@vitbhopal.ac.in	7373840707
60	Swati Singh 	24BEY10046 	swati.24bey10046@vitbhopal.ac.in	9131877977
61	Chaitanya Bagade 	24BCE10621	chaitanya.24bce10621@vitbhopal.ac.in	9975078507
62	Atharv Kondurkar	24BSA10210	atharv.24bsa10210@vitbhopal.ac.in	9004161670
63	Megha gupta	24BCE10905	megha.24bce10905@vitbhopal.ac.in	9068455210
64	Singh Bhumija Lalitkumar 	24BCE11200 	singhbhumija.24bce11200@vitbhopal.ac.in	8828507854
65	Meet Chaure 	24BAI10922	meet.24bai10922@vitbhopal.ac.in	8770972131
66	Ruchir Deshpande 	24BHI10028	ruchir.24bhi10028@vitbhopal.ac.in	9145050706
67	Bhumika Gupta 	24BCE10178	bhumika.24bce10178@vitbhopal.ac.in	8287928039
68	Hirdyansh Garg 	24BCY10157	hirdyansh.24bcy10157@vitbhopal.ac.in	6397190674
69	Harshvardhan Deshmukh 	24BEC10161	deshmukh.24bec10161@vitbhopal.ac.in	9529133635
70	Saee Patil	24BCY10085 	saee.24bcy10085@vitbhopal.ac.in	7588114372
71	Bhumi Agrawal	24BCE11410	bhumi.24bce11410@vitbhopal.ac.in	8435151718
72	Milan verma 	24MIM10076	milan.24mim10076@vitbhopal.ac.in	9630431876
73	Avika Bansal 	24BCE10772	avika.24bce10772@vitbhopal.ac.in	6397337037
74	Heramb Krishna Arora 	24BCE10154	heramb.24bce10154@vitbhopal.ac.in	9793008979
75	Pragati	24MIP10070	pragati.24mip10070@vitbhopal.ac.in	9582140919
76	Armaan Das 	24BSA10097	armaan.24bsa10097@vitbhopal.ac.in	9395101422
77	Dev Santosh Sarangdhar 	24BCE10233	dev.24bce10233@vitbhopal.ac.in	8788383420
78	Parnika	24BCE10239	parnika.24bce10239@vitbhopal.ac.in	9035764436
79	Krishnapal Thakur	24bcy10269	krishnapal.24bcy10269@vitbhopal.ac.in	9301323063
80	Yuvraj dwivedi 	24BSA10062 	yuvraj.24bsa10062@vitbhopal.ac.in	9198162672
81	Mohit Kumar 	24BCY10235 	mohit.24bcy10235@vitbhopal.ac.in	8852839193
82	Aditya Sharma	24BCE10372	aditya.24bce10372@vitbhopal.ac.in	9257907185
83	Sarva Shresth Saini 	24BCG10130 	sarva.24bcg10130@vitbhopal.ac.in	9359231636
84	KAUSHAL KANT	24BCY10062	kaushal.24bcy10062@vitbhopal.ac.in	9608521723
85	Ananya Rajesh Pandey	24BCE10461	ananya.24bce10461@vitbhopal.ac.in	7263859925
86	Dishaa Patil 	24BCE10238	dishaa.24bce10238@vitbhopal.ac.in	9172061500
87	Ayush Prakash 	24MEI10129 	ayush.24mei10129@vitbhopal.ac.in	7061363867
88	Pranshu	24MIP10142	pranshu.24mip10142@vitbhopal.ac.in	7818877929
89	Nayan assudani	24BHI10114	nayan.24bhi10114@vitbhopal.ac.in	9340802151
90	Parikrama Gargav	24BCE10946 	parikrama.24bce10946@vitbhopal.ac.in	8462963647
91	Janhavi kasture	24BCY10053 	janhavi.24bcy10053@vitbhopal.ac.in	9730865814
92	Shivani Nikam	24BEY10074	nikam.24bey10074@vitbhopal.ac.in	9892702476
93	Akhil Kishor Dixit	24BCY10142	akhil.24bcy10142@vitbhopal.ac.in	7398554188
94	Ansh	24BCE10925	ansh.24bce10925@vitbhopal.ac.in	7015516255
95	Ravi mewada 	24BBA10023	ravi.24bba10023@vitbhopal.ac.in	8966994583
96	JAIN ADITYA RAJESHBHAI 	24BSA10063	jain.24bsa10063@vitbhopal.ac.in	8160135123
97	Harshil Mishra	24BCE10043	harshil.24bce10043@vitbhopal.ac.in	7376585871
98	Daman	24BAI10507	daman.24bai10507@vitbhopal.ac.in	8950400125
99	SWASTIK MISHRA 	24BCG10014	swastik.24bcg10014@vitbhopal.ac.in	7317849255
100	Ananya Sharma 	24BAI10039 	ananya.24bai10039@vitbhopal.ac.in	8318302564
101	Shradha suman 	24BOE10041	shradha.24boe10041@vitbhopal.ac.in	9937606921
102	ALKESH JAT	24BCE11215	alkesh.24bce11215@vitbhopal.ac.in	6377009312
103	Aryan Sharma	24BAI10043	aryan.24bai10043@vitbhopal.ac.in	7388497779
104	Manish Patel	24BEC10017 	manish.24bec10017@vitbhopal.ac.in	7970096783
105	Khushi Rai	24BCY10374 	khushi.24bcy10374@vitbhopal.ac.in	7897553272
106	Adarsh kumar gupta 	24BCY10278	adarsh.24bcy10278@vitbhopal.ac.in	7050504702
107	Siddhant Prashant deshmukh	24BCG10128	siddhant.24bcg10128@vitbhopal.ac.in	8484011415
108	Janhavi Vinaykumar Raut 	24BCY10030 	raut.24bcy10030@vitbhopal.ac.in	8007312510
109	Manas Gursahani	24BCE11108	manas.24bce11108@vitbhopal.ac.in	9131008575
110	Kushagra Chaturvedi	24BCE11481	kushagra.24bce11481@vitbhopal.ac.in	9827258090
111	Pratham Shah 	24MIM10063 	pratham.24mim10063@vitbhopal.ac.in	9322098628
112	Neha garg	24BEY10007	neha.24bey10007@vitbhopal.ac.in	9119119237
113	Aditya Singh 	24BCE10249	aditya.24bce10249@vitbhopal.ac.in	9701558316
114	Ayush Tiwari	24BCG10109	ayush.24bcg10109@vitbhopal.ac.in	7067415578
115	Yash Goyal	24BAI10100	yash.24bai10100@vitbhopal.ac.in	7817833974
116	Aditi Barnwal	24BCE10795	aditi.24bce10795@vitbhopal.ac.in	7905912461
117	Bhanu Varma	24BEC10090	ummadisetty.24bec10090@vitbhopal.ac.in	9121515869
118	Sudhanshu Singh	24BCY10410	sudhanshu.24bcy10410@vitbhopal.ac.in	6200149975
119	Vedant pratap singh 	24BCY10211	vedant.24bcy10211@vitbhopal.ac.in	9555319695
120	 Bhavesh Kumar	24BAI10012	bhavesh.24bai10012@vitbhopal.ac.in	7051263398
121	Wakade Anurag	24BCE10796	wakade.24bce10796@vitbhopal.ac.in	9823427385
122	Aditya lahane	24BEC10051	aditya.24bec10051@vitbhopal.ac.in	9356850155
123	Shobhit mishra	24MIM10136	shobhit.24mim10136@vitbhopal.ac.in	8269101452
124	Agasthya Tewari	24BCE11292	agasthya.24bce11292@vitbhopal.ac.in	9415542810
125	Keshav Sharma	24bce11506 	keshav.24bce11506@vitbhopal.ac.in	9650308109
126	Tulip Pal 	24BCE11508 	tulip.24bce11508@vitbhopal.ac.in	9369920906
127	Saish Nimbalkar	24BEY10010	saish.24bey10010@vitbhopal.ac.in	9623302845
128	Shivangi agnihotri	24boe10048	shivangi.24boe10048@vitbhopal.ac.in	9219976346
129	MADHAV MUKUND	24BCG10146	madhav.24bcg10146@vitbhopal.ac.in	7017474112
130	Om Shrivastava	24BSA10362	shrivastava.24bsa10362@vitbhopal.ac.in	9424099845
131	Tanu Sahu 	24BCY10233	tanu.24bcy10233@vitbhopal.ac.in	7999332414
132	Heeral Jiwnani	24BHI10009	heeral.24bhi10009@vitbhopal.ac.in	8890099547
133	Riya Singh	24BCE10840	riya.24bce10840@vitbhopal.ac.in	8130370190
134	Anoushka Borah 	24BHI10095	anoushka.24bhi10095@vitbhopal.ac.in	8584831854
135	Ashish Raj 	24BSA10316 	ashish.24bsa10316@vitbhopal.ac.in	7645087100
136	SAKSHAM RAUT	24MIM10077	raut.24mim10077@vitbhopal.ac.in	9145157108
137	Heramb Patil 	24MIP10002	heramb.24mip10002@vitbhopal.ac.in	9403378869
138	Ashutosh Shrivastava 	24BCE11476	ashutosh.24bce11476@vitbhopal.ac.in	7879797039
139	Harshita Suchak	24BCE10476	harshita.24bce10476@vitbhopal.ac.in	8815137060
140	Yash Gajanan Lokhande	24MIP10095	yash.24mip10095@vitbhopal.ac.in	7822826682
141	Arjun Udawant	24MIP10063	arjunkumar.24mip10063@vitbhopal.ac.in	7058484880
142	Lubhani jain	24BOE10044	lubhani.24boe10044@vitbhopal.ac.in	8112209811
143	Aryan Agarwal	24BEY10048	aryan.24bey10048@vitbhopal.ac.in	9783719088
144	Prem rathore	24MIM10085	prem.24mim10085@vitbhopal.ac.in	9826126540
145	Jihi Mamtani	24BAI10400	jihi.24bai10400@vitbhopal.ac.in	8602067670
146	Aditya Raj Sharma	24BCE10497	aditya.24bce10497@vitbhopal.ac.in	9452996405
147	Samaira Quadri	24BAI10454	samaira.24bai10454@vitbhopal.ac.in	6202723544
148	Padma Tripathi	24BSA10137	padma.24bsa10137@vitbhopal.ac.in	8726356264
149	Bhav Simar	24BSA10145	bhav.24bsa10145@vitbhopal.ac.in	8827515895
150	ADITI PRAKASH 	24BAI10589	aditi.24bai10589@vitbhopal.ac.in	9470042709
151	Asmit Srivastava 	24BCE10634	asmit.24bce10634@vitbhopal.ac.in	9079052598
152	Deeptanshu Kumar Singh	24MEI10018	deeptanshu.24mei10018@vitbhopal.ac.in	6305013182
`;

const volunteers2025Data = `
1	PRANAV DANGE 	25MIP10060	pranav.25mip10060@vitbhopal.ac.in	8305129962
2	Sumedha Bakshi	25BAI10037	sumedha.25bai10037@vitbhopal.ac.in	9958300566
3	Swarit Singh Chauhan 	25BAI10982	swarit.25bai10982@vitbhopal.ac.in	7017423700
4	Itiksha Bhardwaj 	25BAI10069 	itiksha.25bai10069@vitbhopal.ac.in	7669566551
5	Purva KATARIYA	25BCY10115	purva.25bcy10115@vitbhopal.ac.in	8827120054
6	Anjani Kumar Singh	25BAI11167	anjani.25bai11167@vitbhopal.ac.in	9319610467
7	Neil Tarun Parmeshwar 	25BCE10858	neil.25bce10858@vitbhopal.ac.in	7016271726
8	Alfiya Rashid Jamal	25bas10079	alfiya.25bas10079@vitbhopal.ac.in	8857056447
9	GAURI NANDANA M	25BAI10053	gauri.25bai10053@vitbhopal.ac.in	9310200910
10	Pranshu Sanjay Pedgaonkar 	25BOE10099	pedgaonkar.25boe10099@vitbhopal.ac.in	9226352845
11	Rugved Malokar	25BMR10014	rugved.25bmr10014@vitbhopal.ac.in	7058582488
12	Tanishka Pandey	25BAI11496	tanishka.25bai11496@vitbhopal.ac.in	9303741982
13	Aditi singh 	25BCE10868	aditi.25bce10868@vitbhopal.ac.in	7895032935
14	SHRESTHA SARKAR	25BAC10015	shrestha.25bac10015@vitbhopal.ac.in	9433360382
15	Ashwin S Pillai	25MIM10085	ashwin.25mim10085@vitbhopal.ac.in	7977137833
16	Archana G S	25BOE10057	archana.25boe10057@vitbhopal.ac.in	9746980085
17	Saumya Pant 	25BCE10645	saumya.25bce10645@vitbhopal.ac.in	9981995760
18	Ridhima Pandey	25BAI11233	ridhima.25bai11233@vitbhopal.ac.in	9120924053
19	Srestha Gupta	25BOE10126	srestha.25boe10126@vitbhopal.ac.in	9625906199
20	Ankita	25BMR10022	ankita.25bmr10022@vitbhopal.ac.in	8950767669
21	Abhishrey Sharma	25BCE10150	abhishrey.25bce10150@vitbhopal.ac.in	6261008541
22	Rose Shibu 	25BOE10109	rose.25boe10109@vitbhopal.ac.in	9074278523
23	Garvit kabra 	25BAI11244	garvit.25bai11244@vitbhopal.ac.in	9549949931
24	Niharika Dafle	25BOE10048	niharika.25boe10048@vitbhopal.ac.in	9356979246
25	RIDIMA BANKE 	25BHI10023	ridima.25bhi10023@vitbhopal.ac.in	8210123690
26	Aritra Sikder 	25BOE10056	aritra.25boe10056@vitbhopal.ac.in	7003533283
27	Shivansh Pandey 	25BCE10042	shivansh.25bce10042@vitbhopal.ac.in	8445552055
28	Himanshu Saurabh 	25BSA10029	himanshu.25bsa10029@vitbhopal.ac.in	9318375856
29	Harshita Thakur 	25MIM10024	harshita.25mim10024@vitbhopal.ac.in	6267298247
30	Vineha Gupta 	25BAI10610	vineha.25bai10610@vitbhopal.ac.in	8595771691
31	Leena Vaishnav 	25BCE11206	leena.25bce11206@vitbhopal.ac.in	9024051996
32	Pranshi	25BCY10208	pranshi.25bcy10208@vitbhopal.ac.in	8851527488
33	Pari Pancholiya 	25BSA10049	pari.25bsa10049@vitbhopal.ac.in	8770580742
34	Rashi Mishra	25BCE10683	rashi.25bce10683@vitbhopal.ac.in	9918787919
35	Gopika Menon	25boe10127	gopika.25boe10127@vitbhopal.ac.in	9074037214
36	Banka Srihitha Reddy 	25BAS10065	banka.25bas10065@vitbhopal.ac.in	9390392058
37	Tanisha Bariar 	25BHI10079	tansiha.25bhi10079@vitbhopal.ac.in	9430190951
38	Pragalbha Padhy 	25BAI11493	pragalbha.25bai11493@vitbhopal.ac.in	9938972584
39	Ishant Agrawal 	25BCE11028	ishant.25bce11028@vitbhopal.ac.in	7378128676
40	Arnav Singh 	25BAI10072	arnav.25bai10072@vitbhopal.ac.in	7275942650
41	Katyayani Roy 	25BHI10102	katyayani.25bhi10102@vitbhopal.ac.in	8767736295
42	Rohit Choudhary 	25BAI10869	rohit.25bai10869@vitbhopal.ac.in	9799340935
43	Shrikant Nimbhorkar 	25BAI10434	shrikant.25bai10434@vitbhopal.ac.in	9209691664
44	Tulsi sharma	25BCY10120 	tulsi.25bcy10120@vitbhopal.ac.in	9311552515
45	Aditya Jadhao	25MIM10034	aditya.25mim10034@vitbhopal.ac.in	9561129622
46	Aniket Dinesh Narwade	25MIP10102	narwade.25mip10102@vitbhopal.ac.in	9356614225
47	Deeksha Kaushal 	25BHI10019 	deeksha.25bhi10019@vitbhopal.ac.in	7237894448
48	Sophia Verghese 	25BCE10029	sophia.25bce10029@vitbhopal.ac.in	8955219500
49	Parth Gaur	25BSA10098 	parth.25bsa10098@vitbhopal.ac.in	9782837919
50	Yukta Lilhare 	25BMR10024	yukta.25bmr10024@vitbhopal.ac.in	8484030955
51	Gauri Chaudhary 	25BAI10976	gauri.25bai10976@vitbhopal.ac.in	9520913489
52	Sakshi	25BAI11058	sakshi.25bai11058@vitbhopal.ac.in	8859213190
`;

const eventsData = `
Plantation Drive	8-4-22	Faculty House	2
Event of Home Minister	8-6-22	Bhopal	6
Har Ghar Tirana	8-10-22	Auditorium	2
Independence Day	8-15-22	Main gate and Auditorium	4
NSS Week	9-19-22	VIT Bhopal University	18
Blood donation camp	12-15-22	Auditorium	10
MANIT Visit	1-24-23	Bhopal	6
Republic day Parade	1-26-23	Main Gate	10
Cloth Donation Drive	2-25-23	VIT Bhopal University	6
Nukkad Natak	3-5-23	Dabla, Sehore	12
Blood Donation Camp	5-11-23	Auditorium	10
Plantation Drive	7-20-23	Near Mayuri Canteen	2
Nukkad Natak(Plastic Free campus)	8-5-23	Kotri Primary School	12
National Youth Parliament 	8-14-23	AB207	14
Convocation Volunteering 	11-8-23	Football ground	20
Blood Donation Camp	11-14-23	Auditorium	12
Annual Unit NSS Camp	2-8-24	Kachnaria	115
State NSS Camp	3-2-24	Pachore, Rajgarh	128
Nukkad Natak - women empowerment	3-5-24	Kachnaria	12
Washroom restoration	3-5-24	Kachnaria	6
National Youth Parliament 	4-16-24	Auditorium VIT Bhopal University 	14
UNGLI PE TILAK	5-6-24	MULTI PURPOSE HALL (MPH)	12
Water and Food for Birds	5-8-24	Campus premises	4
EYE CHECK UP CAMP	8-5-24	LC-201	8
NSS Mega Tree Plantation Drive	8-9-24	Ujarkheda, Daboti, Sehore	25
Blood Donation Camp 	8-14-24	Audi 1 & 2	12
NSS Week (Swaccha Hi Seva)	10-2-24	VIT Bhopal University Campus 	15
5th Annual Convocation	10-4-24	Convocation Hall, VIT Bhopal	20
District Pre-RDC Camp	10-10-24	Bhopal	6
BU Level Pre RDC Camp	10-15-24	Bhopal	9
National Integration Camp NSS	10-23-24	Chaudhary Charan Singh University, Hisar, Haryana	120
FIT India Rally	12-5-25	VIT Bhopal University Campus 	2
Blood Donation	12-12-24	Main Auditorium and Mini Auditorium	12
NSS Unit Camp 2025	1-24-25	Bor Kheda, Sehore	115
Nodal District-Level Round of the Viksit Bharat Youth Parliament 2025.	3-22-25	The Bhopal School of Social Sciences (BSSS), Bhopal	8
National Youth Parliament 2025	4-3-25	Auditorium 1	14
Water and Food for Birds 2025	4-15-25	VIT Bhopal Campus Premises	4
Orientation Program 2024	7-17-25	LC-002	6
Mega Tree Plantation Drive 2025	7-24-25	VIT Bhopal University Campus Boundary of around 300acre.	25
Free Eye and Dental Checkup Camp 	7-31-25	Mini Auditorium AB1, VIT Bhopal University	8
VIBGYOR	9-19-25	Auditorium 1, VIT Bhopal University	14
District Pre-RDC Camp	10-4-25	Bhopal	6
BU Level Pre RDC Camp	10-6-25	Bhopal	9
ORIENTATION PROGRAM 2025	11-7-25	Auditorium 1, VIT BHOPAL University 	6
Annual NSS Camp 2026	2-2-26	Bor Kheda, Sehore	115
Blood Donation 2026	3-5-26	AB1- Audi 1 and Audi 2	12
State NSS Camp	3-8-26	Chitrakut, Satna	128
National Youth Parliament 2026 	4-8-26	AB1, Auditorium 1, VIT BHOPAL University 	14
B-Certificate Examination 2026	4-9-26	Auditorium 2, AB-01, VIT Bhopal University	10
Water and Food for Birds	4-10-26	AB01 Main Gate	4
Ambedkar Jayanti Celebration	4-13-26	Auditorium 2, AB-01, VIT Bhopal University	4
`;

const parseVolunteers = (data: string, batch: string) => {
  return data.trim().split('\n').filter(line => line.trim()).map(line => {
    const parts = line.split('\t');
    return {
      name: parts[1].trim(),
      registrationNumber: parts[2].trim().toUpperCase(),
      email: parts[3].trim(),
      phoneNumber: parts[4] ? parts[4].trim() : '',
      role: Role.VOLUNTEER,
      batch,
      accumulatedHours: 0,
      bunks: 0,
      certificates: []
    };
  });
};

const parseEvents = (data: string) => {
  return data.trim().split('\n').filter(line => line.trim()).map(line => {
    const parts = line.split('\t');
    
    // Parse Date (MM-DD-YY or MM/DD/YYYY to Date object)
    let dateStr = parts[1].trim();
    if(dateStr.includes('-')) {
       const [m, d, y] = dateStr.split('-');
       let year = parseInt(y);
       if(year < 100) year += 2000;
       dateStr = `${m}-${d}-${year}`;
    }

    return {
      title: parts[0].trim(),
      category: 'General',
      date: new Date(dateStr),
      venue: parts[2] ? parts[2].trim() : 'VIT Bhopal',
      hoursAllocated: parts[3] ? parseInt(parts[3].trim()) || 0 : 0,
      description: 'Join us for this exciting NSS initiative. More details to follow.',
      isRegistrationOpen: false,
      workingHours: 0
    };
  });
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nss-website');
    console.log('Connected to MongoDB');

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Activity.deleteMany({});
    
    console.log('Creating Admin Account...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('NSS@2026', salt);
    await User.create({
      name: 'NSS Admin',
      registrationNumber: 'ADMIN',
      email: 'nss@vitbhopal.ac.in',
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      accumulatedHours: 0,
      bunks: 0
    });

    console.log('Seeding Volunteers...');
    const v2024 = parseVolunteers(volunteers2024Data, '2024');
    const v2025 = parseVolunteers(volunteers2025Data, '2025');
    await User.insertMany([...v2024, ...v2025]);
    console.log(`Successfully seeded ${v2024.length + v2025.length} volunteers.`);

    console.log('Seeding Events...');
    const events = parseEvents(eventsData);
    await Activity.insertMany(events);
    console.log(`Successfully seeded ${events.length} events.`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
