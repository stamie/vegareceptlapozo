const min_date = "2026-10-17";
let max_date = Date.now().toString();
console.log(max_date);
let menu_dates = {
  0: "2026-10-17",
  1: "2026-10-18",
  2: "2026-10-19",
  3: "2026-10-20",
  4: "2026-10-21",
  5: "2026-10-22",
};

let thead = {};
for (let i = 0; i < menu_dates.length; i++) {
  let thead_ = `<thead>
  <tr class="bg-slate-900 text-white"><th colspan="5"
                  class="py-3 px-4 text-center font-semibold text-base" 
                  data-field="datum" 
                  data-date="${menu_dates[i]}">📅 ${menu_dates[i]}
                </th>
              </tr>
              <tr
                class="bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200"
              >
                <th class="py-3 px-4" data-field="etkezes">Étkezés</th>
                <th class="py-3 px-4" data-field="ido">Időpont</th>
                <th class="py-3 px-4" data-field="fogasok" colspan="2">
                  Fogások
                </th>
                <th class="py-3 px-4" data-field="mennyiseg">Mennyiség</th>
              </tr>
              </thead>
            `;
  thead[i] = thead_;
}

let tbody = `<tbody class="divide-y divide-slate-100 text-sm text-slate-700">
              <tr class="hover:bg-slate-50 transition" data-field="reggeli">
                <td
                  class="py-3 px-4 font-medium text-slate-900"
                  data-field="etkezes"
                  rowspan="2"
                >
                  Reggeli
                </td>
                <td
                  class="py-3 px-4 text-slate-500"
                  data-field="ido"
                  rowspan="2"
                >
                  7:00
                </td>
                <td class="py-3 px-4" data-field="fogasok">Kenyér</td>
                <td class="py-3 px-4" data-field="osszetevok">Kenyér</td>
                <td
                  class="py-3 px-4 font-semibold text-emerald-600"
                  data-field="mennyiseg"
                >
                  10 g
                </td>
              </tr>
              <tr class="hover:bg-slate-50 transition">
                <td class="py-3 px-4" data-field="fogasok">Sajt</td>
                <td class="py-3 px-4" data-field="osszetevok">Sajt</td>
                <td
                  class="py-3 px-4 font-semibold text-emerald-600"
                  data-field="mennyiseg"
                >
                  5 g
                </td>
              </tr>
              <tr class="hover:bg-slate-50 transition" data-field="tizorai">
                <td
                  class="py-3 px-4 font-medium text-slate-900"
                  data-field="etkezes"
                >
                  Tízórai
                </td>
                <td class="py-3 px-4 text-slate-500" data-field="ido">10:00</td>
                <td class="py-3 px-4" data-field="fogasok">Tea</td>
                <td class="py-3 px-4" data-field="osszetevok">Tea</td>
                <td
                  class="py-3 px-4 font-semibold text-emerald-600"
                  data-field="mennyiseg"
                >
                  200 ml
                </td>
              </tr>
              <tr class="hover:bg-slate-50 transition" data-field="ebed">
                <td
                  class="py-3 px-4 font-medium text-slate-900"
                  data-field="etkezes"
                >
                  Ebéd
                </td>
                <td class="py-3 px-4 text-slate-500" data-field="ido">12:00</td>
                <td class="py-3 px-4" data-field="fogasok">Rántott hús</td>
                <td class="py-3 px-4" data-field="osszetevok">Rántott hús</td>
                <td
                  class="py-3 px-4 font-semibold text-emerald-600"
                  data-field="mennyiseg"
                >
                  150 g
                </td>
              </tr>
              <tr class="hover:bg-slate-50 transition" data-field="uzsonna">
                <td
                  class="py-3 px-4 font-medium text-slate-900"
                  data-field="etkezes"
                >
                  Uzsonna
                </td>
                <td class="py-3 px-4 text-slate-500" data-field="ido">15:00</td>
                <td class="py-3 px-4" data-field="fogasok">Gabonak</td>
                <td class="py-3 px-4" data-field="osszetevok">Gabonak</td>
                <td
                  class="py-3 px-4 font-semibold text-emerald-600"
                  data-field="mennyiseg"
                >
                  50 g
                </td>
              </tr>
              <tr class="hover:bg-slate-50 transition" data-field="vacsora">
                <td
                  class="py-3 px-4 font-medium text-slate-900"
                  data-field="etkezes"
                >
                  Vacsora
                </td>
                <td class="py-3 px-4 text-slate-500" data-field="ido">19:00</td>
                <td class="py-3 px-4" data-field="fogasok">Zöldségek</td>
                <td class="py-3 px-4" data-field="osszetevok">Zöldségek</td>
                <td
                  class="py-3 px-4 font-semibold text-emerald-600"
                  data-field="mennyiseg"
                >
                  100 g
                </td>
              </tr>
            </tbody>`;
           