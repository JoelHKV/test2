import './style.css'

var map;
var lat = 63.5
var lon = 25
var latstep = 0
var marker = []
var infowindow = {}

var nroitems = 120

var blankcoat = 'https://storage.googleapis.com/joeltestfiles/shield-black-icon.png'
//var dada = [ "Akaa", "//upload.wikimedia.org/wikipedia/commons/thumb/5/52/Akaa.vaakuna.svg/75px-Akaa.vaakuna.svg.png", "61.1", "23.5205", "Alajärvi", "//upload.wikimedia.org/wikipedia/commons/thumb/1/13/Alaj%C3%A4rvi.vaakuna.svg/75px-Alaj%C3%A4rvi.vaakuna.svg.png", "63.0", "23.49", "Alavieska", "//upload.wikimedia.org/wikipedia/commons/thumb/6/64/Alavieska.vaakuna.svg/75px-Alavieska.vaakuna.svg.png", "64.0955", "24.1825", "Alavus" ]

var dada = ["Akaa", "//upload.wikimedia.org/wikipedia/commons/thumb/5/52/Akaa.vaakuna.svg/75px-Akaa.vaakuna.svg.png", "61.1", "23.5205", "Alajärvi", "//upload.wikimedia.org/wikipedia/commons/thumb/1/13/Alaj%C3%A4rvi.vaakuna.svg/75px-Alaj%C3%A4rvi.vaakuna.svg.png", "63.0", "23.49", "Alavieska", "//upload.wikimedia.org/wikipedia/commons/thumb/6/64/Alavieska.vaakuna.svg/75px-Alavieska.vaakuna.svg.png", "64.0955", "24.1825", "Alavus", "//upload.wikimedia.org/wikipedia/commons/thumb/6/62/T%C3%B6ys%C3%A4.vaakuna.svg/75px-T%C3%B6ys%C3%A4.vaakuna.svg.png", "62.351", "23.371", "Asikkala", "//upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Asikkala.vaakuna.svg/75px-Asikkala.vaakuna.svg.png", "61.102", "25.325", "Askola", "//upload.wikimedia.org/wikipedia/commons/thumb/5/50/Askola.vaakuna.svg/75px-Askola.vaakuna.svg.png", "60.314", "25.36", "Aura (kunta)", "//upload.wikimedia.org/wikipedia/commons/thumb/4/45/Aura.vaakuna.svg/75px-Aura.vaakuna.svg.png", "60.39", "22.35", "Brändö", "//upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Br%C3%A4nd%C3%B6.vaakuna.svg/75px-Br%C3%A4nd%C3%B6.vaakuna.svg.png", "60.244", "21.0245", "Eckerö", "//upload.wikimedia.org/wikipedia/commons/thumb/b/be/Ecker%C3%B6.vaakuna.svg/75px-Ecker%C3%B6.vaakuna.svg.png", "60.1325", "19.3325", "Enonkoski", "//upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Enonkoski.vaakuna.svg/75px-Enonkoski.vaakuna.svg.png", "62.052", "28.56", "Enontekiö", "//upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Enonteki%C3%B6.vaakuna.svg/75px-Enonteki%C3%B6.vaakuna.svg.png", "68.2305", "23.382", "Espoo", "//upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Espoo.vaakuna.svg/75px-Espoo.vaakuna.svg.png", "60.122", "24.392", "Eura", "//upload.wikimedia.org/wikipedia/commons/thumb/d/df/Eura.vaakuna.svg/75px-Eura.vaakuna.svg.png", "61.075", "22.0825", "Eurajoki", "//upload.wikimedia.org/wikipedia/commons/thumb/5/56/Luvia.vaakuna.svg/75px-Luvia.vaakuna.svg.png", "61.1205", "21.435", "Evijärvi", "//upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Evij%C3%A4rvi.svg/75px-Evij%C3%A4rvi.svg.png", "63.22", "23.283", "Finström", "//upload.wikimedia.org/wikipedia/commons/thumb/9/90/Finstr%C3%B6m.vaakuna.svg/75px-Finstr%C3%B6m.vaakuna.svg.png", "60.1345", "19.592", "Forssa", "//upload.wikimedia.org/wikipedia/commons/thumb/5/51/Forssan_vaakuna.svg/75px-Forssan_vaakuna.svg.png", "60.485", "23.372", "Föglö", "//upload.wikimedia.org/wikipedia/commons/thumb/8/81/F%C3%B6gl%C3%B6.vaakuna.svg/75px-F%C3%B6gl%C3%B6.vaakuna.svg.png", "60.015", "20.2315", "Geta (kunta)", "//upload.wikimedia.org/wikipedia/commons/thumb/2/21/Geta.vaakuna.svg/75px-Geta.vaakuna.svg.png", "60.223", "19.5045", "Haapajärvi", "//upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Haapaj%C3%A4rvi.vaakuna.svg/75px-Haapaj%C3%A4rvi.vaakuna.svg.png", "63.4455", "25.1905", "Haapavesi", "//upload.wikimedia.org/wikipedia/commons/thumb/8/88/Haapavesi.vaakuna.svg/75px-Haapavesi.vaakuna.svg.png", "64.0815", "25.22", "Hailuoto", "//upload.wikimedia.org/wikipedia/commons/thumb/5/50/Hailuoto.vaakuna.svg/75px-Hailuoto.vaakuna.svg.png", "65.01", "24.43", "Halsua", "//upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Halsua.vaakuna.svg/75px-Halsua.vaakuna.svg.png", "63.275", "24.1", "Hamina", "//upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Hamina.vaakuna.svg/75px-Hamina.vaakuna.svg.png", "60.3411", "27.1153", "Hammarland", "//upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Hammarland.vaakuna.svg/75px-Hammarland.vaakuna.svg.png", "60.13", "19.4425", "Hankasalmi", "//upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Hankasalmi.vaakuna.svg/75px-Hankasalmi.vaakuna.svg.png", "62.232", "26.261", "Hanko", "//upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Hanko.vaakuna.svg/75px-Hanko.vaakuna.svg.png", "59.4925", "22.5805", "Harjavalta", "//upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Harjavalta.vaakuna.svg/75px-Harjavalta.vaakuna.svg.png", "61.185", "22.083", "Hartola", "//upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Hartola.vaakuna.svg/75px-Hartola.vaakuna.svg.png", "61.3445", "26.0115", "Hattula", "//upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Hattula.vaakuna.svg/75px-Hattula.vaakuna.svg.png", "61.032", "24.2215", "Hausjärvi", "//upload.wikimedia.org/wikipedia/commons/thumb/9/95/Hausj%C3%A4rvi.vaakuna.svg/75px-Hausj%C3%A4rvi.vaakuna.svg.png", "60.4715", "25.014", "Heinola", "//upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Heinola.vaakuna.svg/75px-Heinola.vaakuna.svg.png", "61.121", "26.0155", "Heinävesi", "//upload.wikimedia.org/wikipedia/commons/thumb/5/58/Hein%C3%A4vesi.vaakuna.svg/75px-Hein%C3%A4vesi.vaakuna.svg.png", "62.2535", "28.375", "Helsinki", "//upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Helsinki.vaakuna.svg/75px-Helsinki.vaakuna.svg.png", "60.1015", "24.5615", "Hirvensalmi", "//upload.wikimedia.org/wikipedia/commons/thumb/5/57/Hirvensalmi.vaakuna.svg/75px-Hirvensalmi.vaakuna.svg.png", "61.382", "26.465", "Hollola", "//upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Hollola.vaakuna.svg/75px-Hollola.vaakuna.svg.png", "60.5915", "25.31", "Huittinen", "//upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Huittisten.vaakuna.svg/75px-Huittisten.vaakuna.svg.png", "61.1035", "22.4155", "Humppila", "//upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Humppilan_vaakuna.svg/75px-Humppilan_vaakuna.svg.png", "60.5525", "23.2205", "Hyrynsalmi", "//upload.wikimedia.org/wikipedia/commons/thumb/0/06/Hyrynsalmi.vaakuna.svg/75px-Hyrynsalmi.vaakuna.svg.png", "64.4035", "28.294", "Hyvinkää", "//upload.wikimedia.org/wikipedia/commons/thumb/3/34/Hyvinkaa.vaakuna.svg/75px-Hyvinkaa.vaakuna.svg.png", "60.375", "24.5135", "Hämeenkyrö", "//upload.wikimedia.org/wikipedia/commons/thumb/e/e6/H%C3%A4meenkyr%C3%B6.vaakuna.svg/75px-H%C3%A4meenkyr%C3%B6.vaakuna.svg.png", "61.382", "23.115", "Hämeenlinna", "//upload.wikimedia.org/wikipedia/commons/thumb/d/da/H%C3%A4meenlinna.vaakuna.svg/75px-H%C3%A4meenlinna.vaakuna.svg.png", "61.0", "24.28", "Ii", "//upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Kuivaniemi.vaakuna.svg/75px-Kuivaniemi.vaakuna.svg.png", "65.19", "25.222", "Iisalmi", "//upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Iisalmi.vaakuna.svg/75px-Iisalmi.vaakuna.svg.png", "63.334", "27.112", "Iitti", "//upload.wikimedia.org/wikipedia/commons/thumb/2/22/Iitti.vaakuna.svg/75px-Iitti.vaakuna.svg.png", "60.532", "26.202", "Ikaalinen", "//upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Ikaalinen.vaakuna.svg/75px-Ikaalinen.vaakuna.svg.png", "61.461", "23.0405", "Ilmajoki", "//upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Ilmajoki.vaakuna.svg/75px-Ilmajoki.vaakuna.svg.png", "62.4355", "22.345", "Ilomantsi", "//upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Ilomantsi.vaakuna.svg/75px-Ilomantsi.vaakuna.svg.png", "62.402", "30.555", "Imatra", "//upload.wikimedia.org/wikipedia/commons/thumb/6/60/Imatra.vaakuna.svg/75px-Imatra.vaakuna.svg.png", "61.1135", "28.4635", "Inari", "//upload.wikimedia.org/wikipedia/commons/thumb/7/76/Inari.vaakuna.svg/75px-Inari.vaakuna.svg.png", "68.5418", "27.0149", "Inkoo", "//upload.wikimedia.org/wikipedia/commons/thumb/7/71/Inkoo.vaakuna.svg/75px-Inkoo.vaakuna.svg.png", "60.0245", "24.002", "Isojoki", "//upload.wikimedia.org/wikipedia/commons/thumb/d/db/Isojoki.vaakuna.svg/75px-Isojoki.vaakuna.svg.png", "62.065", "21.573", "Isokyrö", "//upload.wikimedia.org/wikipedia/commons/thumb/0/05/Isokyr%C3%B6.vaakuna.svg/75px-Isokyr%C3%B6.vaakuna.svg.png", "63.0", "22.193", "Janakkala", "//upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Janakkala.vaakuna.svg/75px-Janakkala.vaakuna.svg.png", "60.552", "24.385", "Joensuu", "//upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Joensuu.vaakuna.svg/75px-Joensuu.vaakuna.svg.png", "62.36", "29.455", "Jokioinen", "//upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Jokioinen.vaakuna.svg/75px-Jokioinen.vaakuna.svg.png", "60.4815", "23.291", "Jomala", "//upload.wikimedia.org/wikipedia/commons/thumb/6/68/Jomala.vapen.svg/75px-Jomala.vapen.svg.png", "60.091", "19.5655", "Joroinen", "//upload.wikimedia.org/wikipedia/commons/thumb/7/72/Joroinen.vaakuna.svg/75px-Joroinen.vaakuna.svg.png", "62.1045", "27.494", "Joutsa", "//upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Joutsa.vaakuna.svg/75px-Joutsa.vaakuna.svg.png", "61.443", "26.0655", "Juuka", "//upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Juuka.vaakuna.svg/75px-Juuka.vaakuna.svg.png", "63.143", "29.151", "Juupajoki", "//upload.wikimedia.org/wikipedia/commons/thumb/6/60/Juupajoki.vaakuna.svg/75px-Juupajoki.vaakuna.svg.png", "61.475", "24.221", "Juva", "//upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Juva.vaakuna.svg/75px-Juva.vaakuna.svg.png", "61.535", "27.5125", "Jyväskylä", "//upload.wikimedia.org/wikipedia/commons/thumb/9/93/Jyv%C3%A4skyl%C3%A4.vaakuna.svg/75px-Jyv%C3%A4skyl%C3%A4.vaakuna.svg.png", "62.1425", "25.444", "Jämijärvi", "//upload.wikimedia.org/wikipedia/commons/thumb/2/2c/J%C3%A4mij%C3%A4rvi.vaakuna.svg/75px-J%C3%A4mij%C3%A4rvi.vaakuna.svg.png", "61.491", "22.413", "Jämsä", "//upload.wikimedia.org/wikipedia/commons/thumb/5/51/J%C3%A4ms%C3%A4nkoski.vaakuna.svg/75px-J%C3%A4ms%C3%A4nkoski.vaakuna.svg.png", "61.515", "25.1125", "Järvenpää", "//upload.wikimedia.org/wikipedia/commons/thumb/3/31/Jarvenpaa.vaakuna.svg/75px-Jarvenpaa.vaakuna.svg.png", "60.282", "25.052", "Kaarina", "//upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Piikki%C3%B6.vaakuna.svg/75px-Piikki%C3%B6.vaakuna.svg.png", "60.2425", "22.222", "Kaavi", "//upload.wikimedia.org/wikipedia/commons/thumb/4/48/Kaavi.vaakuna.svg/75px-Kaavi.vaakuna.svg.png", "62.583", "28.2855", "Kajaani", "//upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Kajaani.vaakuna.svg/75px-Kajaani.vaakuna.svg.png", "64.133", "27.44", "Kalajoki", "//upload.wikimedia.org/wikipedia/commons/thumb/7/77/Himanka.vaakuna.svg/75px-Himanka.vaakuna.svg.png", "64.1535", "23.5655", "Kangasala", "//upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Kangasala.vaakuna.svg/75px-Kangasala.vaakuna.svg.png", "61.275", "24.042", "Kangasniemi", "//upload.wikimedia.org/wikipedia/commons/thumb/0/06/Kangasniemi.vaakuna.svg/75px-Kangasniemi.vaakuna.svg.png", "61.5925", "26.3835", "Kankaanpää", "//upload.wikimedia.org/wikipedia/commons/thumb/d/df/Kankaanp%C3%A4%C3%A4.vaakuna.svg/75px-Kankaanp%C3%A4%C3%A4.vaakuna.svg.png", "61.4815", "22.234", "Kannonkoski", "//upload.wikimedia.org/wikipedia/commons/thumb/7/76/Kannonkoski.vaakuna.svg/75px-Kannonkoski.vaakuna.svg.png", "62.5835", "25.1545", "Kannus (kaupunki)", "//upload.wikimedia.org/wikipedia/commons/thumb/2/25/Kannus.vaakuna.svg/75px-Kannus.vaakuna.svg.png", "63.54", "23.55", "Karijoki", "//upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Karijoki.vaakuna.svg/75px-Karijoki.vaakuna.svg.png", "62.1825", "21.4225", "Karkkila", "//upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Karkkila.vaakuna.svg/75px-Karkkila.vaakuna.svg.png", "60.3205", "24.1235", "Karstula", "//upload.wikimedia.org/wikipedia/commons/thumb/7/73/Karstula.vaakuna.svg/75px-Karstula.vaakuna.svg.png", "62.524", "24.481", "Karvia", "//upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Karvia.vaakuna.svg/75px-Karvia.vaakuna.svg.png", "0", "0", "Kaskinen", "//upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Kaskinen.vaakuna.svg/75px-Kaskinen.vaakuna.svg.png", "62.2305", "21.132", "Kauhajoki", "//upload.wikimedia.org/wikipedia/commons/thumb/0/01/Kauhajoki.vaakuna.svg/75px-Kauhajoki.vaakuna.svg.png", "62.2525", "22.1035", "Kauhava", "//upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Kauhava.vaakuna.2009.svg/75px-Kauhava.vaakuna.2009.svg.png", "63.0605", "23.035", "Kauniainen", "//upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Kauniainen.vaakuna.svg/75px-Kauniainen.vaakuna.svg.png", "60.1235", "24.4345", "Kaustinen", "//upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Kaustinen.vaakuna.svg/75px-Kaustinen.vaakuna.svg.png", "63.3255", "23.4125", "Keitele", "//upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Keitele.vaakuna.svg/75px-Keitele.vaakuna.svg.png", "63.1045", "26.21", "Kemi", "//upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Kemi.vaakuna.svg/75px-Kemi.vaakuna.svg.png", "65.441", "24.335", "Kemijärvi", "//upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Kemij%C3%A4rvi.vaakuna.svg/75px-Kemij%C3%A4rvi.vaakuna.svg.png", "66.425", "27.26", "Keminmaa", "//upload.wikimedia.org/wikipedia/commons/thumb/2/20/Keminmaa.vaakuna.svg/75px-Keminmaa.vaakuna.svg.png", "65.4805", "24.324", "Kemiönsaari", "//upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Dragsfj%C3%A4rd.vaakuna.svg/75px-Dragsfj%C3%A4rd.vaakuna.svg.png", "60.095", "22.434", "Kempele", "//upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Kempele.vaakuna.svg/75px-Kempele.vaakuna.svg.png", "64.5445", "25.303", "Kerava", "//upload.wikimedia.org/wikipedia/commons/thumb/8/87/Kerava.vaakuna.svg/75px-Kerava.vaakuna.svg.png", "60.241", "25.06", "Keuruu", "//upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Keuruu.vaakuna.svg/75px-Keuruu.vaakuna.svg.png", "62.1535", "24.4225", "Kihniö", "//upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Kihni%C3%B6.vaakuna.svg/75px-Kihni%C3%B6.vaakuna.svg.png", "62.123", "23.1045", "Kinnula", "//upload.wikimedia.org/wikipedia/commons/thumb/7/73/Kinnula_coat_of_arms.svg/75px-Kinnula_coat_of_arms.svg.png", "63.22", "24.58", "Kirkkonummi", "//upload.wikimedia.org/wikipedia/commons/thumb/d/db/Kirkkonummi.vaakuna.svg/75px-Kirkkonummi.vaakuna.svg.png", "60.0725", "24.262", "Kitee", "//upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Kitee.vaakuna.svg/75px-Kitee.vaakuna.svg.png", "62.0555", "30.0815", "Kittilä", "//upload.wikimedia.org/wikipedia/commons/thumb/2/26/Kittil%C3%A4.vaakuna.svg/75px-Kittil%C3%A4.vaakuna.svg.png", "67.3925", "24.543", "Kiuruvesi", "//upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Kiuruvesi.vaakuna.svg/75px-Kiuruvesi.vaakuna.svg.png", "63.391", "26.371", "Kivijärvi", "//upload.wikimedia.org/wikipedia/commons/thumb/1/12/Kivij%C3%A4rvi.vaakuna.svg/75px-Kivij%C3%A4rvi.vaakuna.svg.png", "63.071", "25.043", "Kokemäki", "//upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Kokem%C3%A4ki.vaakuna.svg/75px-Kokem%C3%A4ki.vaakuna.svg.png", "61.152", "22.2055", "Kokkola", "//upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Kokkola.vaakuna.svg/75px-Kokkola.vaakuna.svg.png", "63.502", "23.0755", "Kolari", "//upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Kolari.vaakuna.svg/75px-Kolari.vaakuna.svg.png", "67.195", "23.464", "Konnevesi", "//upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Konnevesi.vaakuna.svg/75px-Konnevesi.vaakuna.svg.png", "62.374", "26.1715", "Kontiolahti", "//upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Kontiolahti.vaakuna.svg/75px-Kontiolahti.vaakuna.svg.png", "62.46", "29.51", "Korsnäs", "//upload.wikimedia.org/wikipedia/commons/thumb/7/78/Korsn%C3%A4s.vaakuna.svg/75px-Korsn%C3%A4s.vaakuna.svg.png", "62.471", "21.1105", "Koski Tl", "//upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Koski.Tl.vaakuna.svg/75px-Koski.Tl.vaakuna.svg.png", "60.3915", "23.0825", "Kotka (kaupunki)", "//upload.wikimedia.org/wikipedia/commons/thumb/1/13/Kotka.vaakuna.svg/75px-Kotka.vaakuna.svg.png", "0", "0", "Kouvola", "//upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Kouvola.vaakuna.2009.svg/75px-Kouvola.vaakuna.2009.svg.png", "60.5205", "26.4215", "Kristiinankaupunki", "//upload.wikimedia.org/wikipedia/commons/thumb/4/45/Kristiinankaupunki.vaakuna.svg/75px-Kristiinankaupunki.vaakuna.svg.png", "62.1625", "21.224", "Kruunupyy", "//upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Kruunupyy.vaakuna.svg/75px-Kruunupyy.vaakuna.svg.png", "63.434", "23.02", "Kuhmo", "//upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Kuhmo.vaakuna.svg/75px-Kuhmo.vaakuna.svg.png", "64.074", "29.3105", "Kuhmoinen", "//upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Kuhmoinen.vaakuna.svg/75px-Kuhmoinen.vaakuna.svg.png", "61.335", "25.1055", "Kumlinge", "//upload.wikimedia.org/wikipedia/commons/thumb/4/45/Kumlinge.vapen.svg/75px-Kumlinge.vapen.svg.png", "60.1535", "20.4645", "Kuopio", "//upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Kuopio.vaakuna.svg/75px-Kuopio.vaakuna.svg.png", "62.5333", "27.4042", "Kuortane", "//upload.wikimedia.org/wikipedia/commons/thumb/3/37/Kuortane.vaakuna.svg/75px-Kuortane.vaakuna.svg.png", "62.482", "23.3025", "Kurikka", "//upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Kurikka.vaakuna.2009.svg/75px-Kurikka.vaakuna.2009.svg.png", "62.37", "22.24", "Kustavi", "//upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Kustavi_vaakuna.svg/75px-Kustavi_vaakuna.svg.png", "60.3245", "21.213", "Kuusamo", "//upload.wikimedia.org/wikipedia/commons/thumb/a/af/Kuusamo.vaakuna.svg/75px-Kuusamo.vaakuna.svg.png", "65.58", "29.11", "Kyyjärvi", "//upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Kyyj%C3%A4rvi.vaakuna.svg/75px-Kyyj%C3%A4rvi.vaakuna.svg.png", "63.0235", "24.335", "Kärkölä", "//upload.wikimedia.org/wikipedia/commons/thumb/9/9a/K%C3%A4rk%C3%B6l%C3%A4.vaakuna.svg/75px-K%C3%A4rk%C3%B6l%C3%A4.vaakuna.svg.png", "60.5205", "25.164", "Kärsämäki", "//upload.wikimedia.org/wikipedia/commons/thumb/1/1d/K%C3%A4rs%C3%A4m%C3%A4ki.vaakuna.svg/75px-K%C3%A4rs%C3%A4m%C3%A4ki.vaakuna.svg.png", "63.5845", "25.453", "Kökar", "//upload.wikimedia.org/wikipedia/commons/thumb/3/35/K%C3%B6kar.vaakuna.svg/75px-K%C3%B6kar.vaakuna.svg.png", "59.5515", "20.5435", "Lahti", "//upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Lahti.vaakuna.svg/75px-Lahti.vaakuna.svg.png", "60.585", "25.392", "Laihia", "//upload.wikimedia.org/wikipedia/commons/thumb/7/76/Laihia.vaakuna.svg/75px-Laihia.vaakuna.svg.png", "62.5835", "22.004", "Laitila", "//upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Laitila_vaakuna.svg/75px-Laitila_vaakuna.svg.png", "60.5245", "21.4135", "Lapinjärvi", "//upload.wikimedia.org/wikipedia/commons/thumb/7/72/Lapinj%C3%A4rvi.vaakuna.svg/75px-Lapinj%C3%A4rvi.vaakuna.svg.png", "60.3725", "26.115", "Lapinlahti", "//upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Lapinlahti.vaakuna.svg/75px-Lapinlahti.vaakuna.svg.png", "63.22", "27.2331", "Lappajärvi", "//upload.wikimedia.org/wikipedia/commons/thumb/6/65/Lappaj%C3%A4rvi.vaakuna.svg/75px-Lappaj%C3%A4rvi.vaakuna.svg.png", "63.1305", "23.3745", "Lappeenranta", "//upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Lappeenranta.vaakuna.svg/75px-Lappeenranta.vaakuna.svg.png", "61.04", "28.11", "Lapua", "//upload.wikimedia.org/wikipedia/commons/thumb/6/60/Lapua.vaakuna.svg/75px-Lapua.vaakuna.svg.png", "62.5815", "23.0025", "Laukaa", "//upload.wikimedia.org/wikipedia/commons/thumb/d/db/Laukaa.vaakuna.svg/75px-Laukaa.vaakuna.svg.png", "62.245", "25.5715", "Lemi", "//upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Lemi.vaakuna.svg/75px-Lemi.vaakuna.svg.png", "61.034", "27.4815", "Lemland", "//upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Lemland.vaakuna.svg/75px-Lemland.vaakuna.svg.png", "60.041", "20.051", "Lempäälä", "//upload.wikimedia.org/wikipedia/commons/thumb/9/99/Lemp%C3%A4%C3%A4l%C3%A4.vaakuna.svg/75px-Lemp%C3%A4%C3%A4l%C3%A4.vaakuna.svg.png", "61.185", "23.451", "Leppävirta", "//upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Lepp%C3%A4virta.vaakuna.svg/75px-Lepp%C3%A4virta.vaakuna.svg.png", "62.293", "27.4715", "Lestijärvi", "//upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Lestij%C3%A4rvi.vaakuna.svg/75px-Lestij%C3%A4rvi.vaakuna.svg.png", "0", "0", "Lieksa", "//upload.wikimedia.org/wikipedia/commons/thumb/9/90/Lieksa.vaakuna.svg/75px-Lieksa.vaakuna.svg.png", "63.1905", "30.013", "Lieto", "//upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Lieto_vaakuna.svg/75px-Lieto_vaakuna.svg.png", "60.3015", "22.273", "Liminka", "//upload.wikimedia.org/wikipedia/commons/thumb/5/51/Liminka.vaakuna.svg/75px-Liminka.vaakuna.svg.png", "0", "0", "Liperi (kunta)", "//upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Liperi.vaakuna.svg/75px-Liperi.vaakuna.svg.png", "62.3155", "29.2305", "Lohja", "//upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lohja.vaakuna.svg/75px-Lohja.vaakuna.svg.png", "60.15", "24.04", "Loimaa", "//upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Loimaa.vaakuna.svg/75px-Loimaa.vaakuna.svg.png", "60.5105", "23.033", "Loppi", "//upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Loppi_vaakuna.svg/75px-Loppi_vaakuna.svg.png", "60.4305", "24.263", "Loviisa", "//upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Loviisa.vaakuna.svg/75px-Loviisa.vaakuna.svg.png", "60.2725", "26.133", "Luhanka", "//upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Luhanka.vaakuna.svg/75px-Luhanka.vaakuna.svg.png", "61.48", "25.42", "Lumijoki", "//upload.wikimedia.org/wikipedia/commons/thumb/1/10/Lumijoki.vaakuna.svg/75px-Lumijoki.vaakuna.svg.png", "64.5015", "25.1115", "Lumparland", "//upload.wikimedia.org/wikipedia/commons/thumb/9/93/Lumparland.vaakuna.svg/75px-Lumparland.vaakuna.svg.png", "60.07", "20.153", "Luoto", "//upload.wikimedia.org/wikipedia/commons/thumb/5/50/Luoto.vaakuna.svg/75px-Luoto.vaakuna.svg.png", "63.451", "22.445", "Luumäki", "//upload.wikimedia.org/wikipedia/commons/thumb/2/26/Luum%C3%A4ki.vaakuna.svg/75px-Luum%C3%A4ki.vaakuna.svg.png", "60.552", "27.3345", "Maalahti", "//upload.wikimedia.org/wikipedia/commons/thumb/2/24/Maalahti.vaakuna.svg/75px-Maalahti.vaakuna.svg.png", "62.564", "21.325", "Maarianhamina", "//upload.wikimedia.org/wikipedia/commons/thumb/7/79/Maarianhamina.vaakuna.svg/75px-Maarianhamina.vaakuna.svg.png", "60.0555", "19.564", "Marttila", "//upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Marttila.vaakuna.svg/75px-Marttila.vaakuna.svg.png", "60.3505", "22.54", "Masku", "//upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Askainen.vaakuna.svg/75px-Askainen.vaakuna.svg.png", "60.3415", "22.06", "Merijärvi", "//upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Merijarvi.vaakuna.svg/75px-Merijarvi.vaakuna.svg.png", "64.175", "24.265", "Merikarvia", "//upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Merikarvia.vaakuna.svg/75px-Merikarvia.vaakuna.svg.png", "61.514", "21.303", "Miehikkälä", "//upload.wikimedia.org/wikipedia/commons/thumb/1/17/Miehikkala.vaakuna.svg/75px-Miehikkala.vaakuna.svg.png", "60.4015", "27.42", "Mikkeli", "//upload.wikimedia.org/wikipedia/commons/thumb/0/09/Mikkeli.vaakuna.svg/75px-Mikkeli.vaakuna.svg.png", "61.4115", "27.1625", "Muhos", "//upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Muhos.vaakuna.svg/75px-Muhos.vaakuna.svg.png", "64.4825", "25.594", "Multia", "//upload.wikimedia.org/wikipedia/commons/thumb/5/55/Multia_vaakuna.svg/75px-Multia_vaakuna.svg.png", "62.243", "24.474", "Muonio", "//upload.wikimedia.org/wikipedia/commons/thumb/0/02/Muonio.vaakuna.svg/75px-Muonio.vaakuna.svg.png", "67.5725", "23.4045", "Mustasaari", "//upload.wikimedia.org/wikipedia/commons/thumb/9/94/Mustasaari_vaakuna.svg/75px-Mustasaari_vaakuna.svg.png", "63.0645", "21.404", "Muurame", "//upload.wikimedia.org/wikipedia/commons/thumb/8/88/Muurame.vaakuna.svg/75px-Muurame.vaakuna.svg.png", "0", "0", "Mynämäki", "//upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Myn%C3%A4m%C3%A4ki.vaakuna.svg/75px-Myn%C3%A4m%C3%A4ki.vaakuna.svg.png", "60.4045", "21.592", "Myrskylä", "//upload.wikimedia.org/wikipedia/commons/thumb/2/20/Myrskyl%C3%A4.vaakuna.svg/75px-Myrskyl%C3%A4.vaakuna.svg.png", "60.401", "25.511", "Mäntsälä", "//upload.wikimedia.org/wikipedia/commons/thumb/3/31/M%C3%A4nts%C3%A4l%C3%A4.vaakuna.svg/75px-M%C3%A4nts%C3%A4l%C3%A4.vaakuna.svg.png", "60.381", "25.191", "Mänttä-Vilppula", "//upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Vilppula.vaakuna.svg/75px-Vilppula.vaakuna.svg.png", "62.0145", "24.3725", "Mäntyharju", "//upload.wikimedia.org/wikipedia/commons/thumb/2/26/M%C3%A4ntyharju.vaakuna.svg/75px-M%C3%A4ntyharju.vaakuna.svg.png", "61.2505", "26.5245", "Naantali", "//upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Naantali.vaakuna.svg/75px-Naantali.vaakuna.svg.png", "60.2805", "22.0135", "Nakkila", "//upload.wikimedia.org/wikipedia/commons/thumb/7/79/Nakkila.vaakuna.svg/75px-Nakkila.vaakuna.svg.png", "61.2155", "22.0015", "Nivala", "//upload.wikimedia.org/wikipedia/commons/thumb/9/94/Nivala.vaakuna.svg/75px-Nivala.vaakuna.svg.png", "63.5545", "24.584", "Nokia (kaupunki)", "//upload.wikimedia.org/wikipedia/commons/thumb/2/26/Nokia.vaakuna.svg/75px-Nokia.vaakuna.svg.png", "61.284", "23.3035", "Nousiainen", "//upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Nousiainen.vaakuna.svg/75px-Nousiainen.vaakuna.svg.png", "60.3555", "22.05", "Nurmes", "//upload.wikimedia.org/wikipedia/commons/thumb/8/85/Nurmes.vaakuna.svg/75px-Nurmes.vaakuna.svg.png", "63.324", "29.08", "Nurmijärvi", "//upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Nurmijarvi.vaakuna.svg/75px-Nurmijarvi.vaakuna.svg.png", "60.2745", "24.4825", "Närpiö", "//upload.wikimedia.org/wikipedia/commons/thumb/7/7a/N%C3%A4rpi%C3%B6.vaakuna.svg/75px-N%C3%A4rpi%C3%B6.vaakuna.svg.png", "62.2825", "21.2015", "Orimattila", "//upload.wikimedia.org/wikipedia/commons/thumb/6/68/Orimattila.vaakuna.svg/75px-Orimattila.vaakuna.svg.png", "60.4815", "25.44", "Oripää", "//upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Orip%C3%A4%C3%A4.vaakuna.svg/75px-Orip%C3%A4%C3%A4.vaakuna.svg.png", "60.512", "22.415", "Orivesi", "//upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Orivesi.vaakuna.svg/75px-Orivesi.vaakuna.svg.png", "61.404", "24.2125", "Oulainen", "//upload.wikimedia.org/wikipedia/commons/thumb/0/05/Oulainen.vaakuna.svg/75px-Oulainen.vaakuna.svg.png", "64.16", "24.49", "Oulu", "//upload.wikimedia.org/wikipedia/commons/thumb/3/36/Oulu.vaakuna.svg/75px-Oulu.vaakuna.svg.png", "65.01", "25.28", "Outokumpu", "//upload.wikimedia.org/wikipedia/commons/thumb/4/47/Outokumpu.vaakuna.svg/75px-Outokumpu.vaakuna.svg.png", "62.433", "29.0105", "Padasjoki", "//upload.wikimedia.org/wikipedia/commons/thumb/7/76/Padasjoki.vaakuna.svg/75px-Padasjoki.vaakuna.svg.png", "61.21", "25.163", "Paimio", "//upload.wikimedia.org/wikipedia/commons/thumb/9/99/Paimio_vaakuna.svg/75px-Paimio_vaakuna.svg.png", "60.2725", "22.411"]

var stationdata = 'https://storage.googleapis.com/joeltestfiles/Helsingin_ja_Espoon_kaupunkipy%25C3%25B6r%25C3%25A4asemat_avoin.csv'






initMap()
// Initializeand add tfhe map
function initMap() {
    // The location of Uluru
    const uluru = { lat: lat, lng: lon };
    // The map, centered at Uluru
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 5,
        center: uluru,
    });

    //map.setMapTypeId(google.maps.MapTypeId.SATELLITE);

   // var image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Uusikaarlepyy.vaakuna.svg/75px-Uusikaarlepyy.vaakuna.svg.png';
    var image = blankcoat
    
    for (let i = 0; i < nroitems; i++) {


        //var image = '//upload.wikimedia.org/wikipedia/commons/thumb/1/13/Alaj%C3%A4rvi.vaakuna.svg/75px-Alaj%C3%A4rvi.vaakuna.svg.png'
        //var image = dada[4*i+1]
        
        //alert(dada[4 * i + 3])
        marker[i] = new google.maps.Marker({
            position: { lat: parseFloat(dada[4 * i + 2]), lng: parseFloat(dada[4 * i + 3]) },
            map: map,
            icon: {
                url: image,
                scaledSize: new google.maps.Size(25, 25),
                optimized: false,
            }

        });
        
        infowindow[i] = new google.maps.InfoWindow({
            content: '<b>' + dada[4 * i + 0] + '</b>'
        });
 
        var thisone = marker[i]
        google.maps.event.addListener(thisone, 'click', (function (thisone) {
            return function () {
                //clickmarker(di)

                clickmarker(i)
               
                                
            }
        })(marker[i]));




    }
 

}


function clickmarker(temp) {

    var markersize = 7 * map.getZoom()
    //infowindow[dada].open(map, thisone)

    for (let i = 0; i < nroitems; i++) {
        infowindow[i].close(map, marker[i])

        marker[i].setIcon({
            url: blankcoat,
            scaledSize: new google.maps.Size(markersize, markersize)
        });

    }
    infowindow[temp].open(map, marker[temp])

    marker[temp].setIcon({
                url: dada[4 * temp + 1],
        scaledSize: new google.maps.Size(markersize, markersize)
          });


}




google.maps.event.addListener(map, 'center_changed', function () {
   // updatemarkers()
});


google.maps.event.addListener(map, 'zoom_changed', function () {
   
   // updatemarkers()
});


function updatemarkers() {
    var center = map.getCenter();
    var markersize = 7 * map.getZoom()
    for (let i = 0; i < nroitems; i++) {

        var image = blankcoat

        var distancex = Math.pow(center.lat() - parseFloat(dada[4 * i + 2]), 2)
        var distancey = Math.pow(center.lng() - parseFloat(dada[4 * i + 3]), 2)
        var distdist = Math.pow(distancex + distancey, 0.5)

        
       
        if (map.getZoom() > 7 && distdist < 0.5) {
            image = dada[4 * i + 1]
  
        }

  
        marker[i].setIcon({
            url: image,
            scaledSize: new google.maps.Size(markersize, markersize)
        });
       // marker[i].setVisible(thisstate);
    }

}


var mapDiv = map.getDiv();
var width = mapDiv.clientWidth;
var height = mapDiv.clientHeight;


var marginstep = 200

moveitmoveit(stepY, stepX)

function moveitmoveit(yy,xx) {

    let element = document.getElementById("map");
    let style = window.getComputedStyle(element);
    let marginTop = style.getPropertyValue("margin-top");
    let marginLeft = style.getPropertyValue("margin-left");
    marginLeft = parseFloat(marginLeft);
    marginTop = parseFloat(marginTop);

    marginLeft = marginLeft + xx
    marginTop = marginTop + yy

    
    if (marginTop > 0) {
        marginTop = marginTop - marginstep;
        var center = map.getCenter();
        var centerY = center.lat() + marginstep * ititialstep(0);
        var centerX = center.lng()
        map.setCenter(new google.maps.LatLng(centerY, centerX));
    }
    if (marginTop < -2 * marginstep) {
        marginTop = marginTop + marginstep;
        var center = map.getCenter();
        var centerY = center.lat() - marginstep * ititialstep(0);
        var centerX = center.lng()
        map.setCenter(new google.maps.LatLng(centerY, centerX));
    }

    if (marginLeft > 0) {
        marginLeft = marginLeft - marginstep;
        var center = map.getCenter();
        var centerY = center.lat() 
        var centerX = center.lng() - marginstep * ititialstep(1);
        map.setCenter(new google.maps.LatLng(centerY, centerX));
    }
    if (marginLeft < -2 * marginstep) {
        marginLeft = marginLeft + marginstep;
        var center = map.getCenter();
        var centerY = center.lat()
        var centerX = center.lng() + marginstep * ititialstep(1);
        map.setCenter(new google.maps.LatLng(centerY, centerX));
    }



   // alert('ff')
    element.style.marginLeft = marginLeft + "px";
    element.style.marginTop = marginTop + "px";


    setTimeout(() => {
        moveitmoveit(stepY, stepX)
    }, "150")


}

var start = map.getCenter();
var end = new google.maps.LatLng(50, 50);
var steps = 100;
var stepDuration = 200;
var stepnro = 0;
var stepX = 0;
var stepY = 0;


function ititialstep(which) {
    let element = document.getElementById("map");
    let style = window.getComputedStyle(element);
    var bounds = map.getBounds();
    var northEast = bounds.getNorthEast();
    var southWest = bounds.getSouthWest();
    if (which == 0) {

        let hhh = style.getPropertyValue("height");
        return (northEast.lat() - southWest.lat()) / parseFloat(hhh);
    }
    if (which == 1) {
        let www = style.getPropertyValue("width")
        //alert((northEast.lng() - southWest.lng()) / parseFloat(www))
        return (northEast.lng() - southWest.lng()) / parseFloat(www);
    }


}

document.querySelector(".up").addEventListener("click", () => {
    stepY+= 1
  



});






var geocoder = new google.maps.Geocoder();
document.querySelector(".down").addEventListener("click", () => {

    stepY -= 1
   

   // geocoder.geocode({ 'address': 'Oulu, Finland' }, function (results, status) {
   //     if (status === 'OK') {
    //        var location = results[0].geometry.location;
  //          alert(location.lat(), location.lng());
 //       } else {
 //          alert('Geocode was not successful for the following reason: ' + status);
 //       }
  //  });



});


document.querySelector(".left").addEventListener("click", () => {
    stepX +=1
    
//    var center = map.getCenter();
 //   var centerY = center.lat() + 1;
//    alert(centerY)
 //      map.setCenter(new google.maps.LatLng(centerY,center.lng()));
});

document.querySelector(".right").addEventListener("click", () => {
    stepX -= 1
    
});



google.maps.event.addListener(map, 'idle', function () {
  


  //  ititialstep() 
 //  var northEast = new google.maps.LatLng(69, 24);
 //  var southWest = new google.maps.LatLng(60, 22);
  //  var bounds = new google.maps.LatLngBounds(southWest, northEast);


    
});