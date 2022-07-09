class App {
  state = {
    rows: [],
  };

  constructor() {
    this.createMeetingRow();
  }

  handleAddRowClicked(el) {
    this.createMeetingRow();
  }

  toHoursAndMinutes(totalMinutes) {
    const minutes = Math.ceil(totalMinutes % 60);
    const hours = Math.floor(totalMinutes / 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  createMeetingRow() {
    const durationOptions = [
      { value: 15, text: "15m" },
      { value: 30, text: "30m" },
      { value: 45, text: "45m" },
      { value: 60, text: "1h" },
      { value: 90, text: "1.5h" },
      { value: 120, text: "2h" },
    ];

    const frequencyOptions = [
      { value: "every-other-day", text: "Every other day" },
      { value: "daily", text: "Daily" },
      { value: "weekly", text: "Weekly" },
      { value: "twice-monthly", text: "Twice a month" },
      { value: "monthly", text: "Monthly" },
      { value: "quarterly", text: "Quarterly" },
    ];

    const durationSelect = document.createElement("select");
    const durationPlaceholder = document.createElement("option");
    durationPlaceholder.text = "Duration";
    durationSelect.appendChild(durationPlaceholder);
    durationSelect.addEventListener("change", (el) => {
      this.state.rows[el.target.parentElement.dataset.rowIdx].duration =
        parseInt(el.target.value);
      this.renderSummary();
    });

    const frequencySelect = document.createElement("select");
    const frequencyPlaceholder = document.createElement("option");
    frequencyPlaceholder.text = "Frequency";
    frequencySelect.appendChild(frequencyPlaceholder);
    frequencySelect.addEventListener("change", (el) => {
      this.state.rows[el.target.parentElement.dataset.rowIdx].frequency =
        el.target.value;
      this.renderSummary();
    });

    const title = document.createElement("input");
    title.type = "text";
    title.placeholder = "Title";

    const deleteIcon = document.createElement("a");
    deleteIcon.text = "Remove";
    deleteIcon.href = "javascript:void(0);";
    deleteIcon.classList.add("delete-link");
    deleteIcon.addEventListener("click", (el) => {
      this.state.rows = this.state.rows.filter((_, i) => {
        return i !== parseInt(el.target.parentElement.dataset.rowIdx);
      });

      el.target.parentElement.remove();
      this.renderSummary();

      document.querySelectorAll(".row").forEach((el, idx) => {
        el.dataset.rowIdx = idx;
      });
    });

    const row = document.createElement("div");
    row.dataset.rowIdx = this.state.rows.length;
    row.classList.add("row");
    row.appendChild(durationSelect);
    row.appendChild(frequencySelect);
    row.appendChild(title);
    row.appendChild(deleteIcon);

    document.querySelector(".items").appendChild(row);

    for (let i = 0; i < durationOptions.length; i++) {
      const option = document.createElement("option");
      option.value = durationOptions[i].value;
      option.text = durationOptions[i].text;
      durationSelect.appendChild(option);
    }

    for (let i = 0; i < frequencyOptions.length; i++) {
      const option = document.createElement("option");
      option.value = frequencyOptions[i].value;
      option.text = frequencyOptions[i].text;
      frequencySelect.appendChild(option);
    }

    this.state.rows.push({ duration: undefined, frequency: undefined });
  }

  renderSummary() {
    const numDaysInAWeek = 5;
    const numWeeksInAMonth = 4;
    const numMonthsInAQuarter = 3;
    const numMonthsInAYear = 12;
    const numQuartersInAYear = 4;

    let dailyWaste = 0;
    let weeklyWaste = 0;
    let monthlyWaste = 0;
    let yearlyWaste = 0;

    this.state.rows.forEach((row) => {
      switch (row.frequency) {
        case "every-other-day":
          dailyWaste += row.duration / 2;
          weeklyWaste += row.duration * 3;
          monthlyWaste += row.duration * 3 * numWeeksInAMonth;
          yearlyWaste += row.duration * 3 * numWeeksInAMonth * numMonthsInAYear;
          break;
        case "daily":
          dailyWaste += row.duration;
          weeklyWaste += row.duration * numDaysInAWeek;
          monthlyWaste += row.duration * numDaysInAWeek * numWeeksInAMonth;
          yearlyWaste +=
            row.duration * numDaysInAWeek * numWeeksInAMonth * numMonthsInAYear;
          break;
        case "weekly":
          dailyWaste += row.duration / numDaysInAWeek;
          weeklyWaste += row.duration;
          monthlyWaste += row.duration * numWeeksInAMonth;
          yearlyWaste += row.duration * numWeeksInAMonth * numMonthsInAYear;
          break;
        case "twice-monthly":
          dailyWaste += (row.duration * 2) / numWeeksInAMonth / numDaysInAWeek;
          weeklyWaste += (row.duration * 2) / numWeeksInAMonth;
          monthlyWaste += row.duration * 2;
          yearlyWaste += row.duration * 2 * numMonthsInAYear;
          break;
        case "monthly":
          dailyWaste += row.duration / numDaysInAWeek / numWeeksInAMonth;
          weeklyWaste += row.duration / numWeeksInAMonth;
          monthlyWaste += row.duration;
          yearlyWaste += row.duration * numMonthsInAYear;
          break;
        case "quarterly":
          dailyWaste +=
            row.duration /
            numDaysInAWeek /
            numWeeksInAMonth /
            numMonthsInAQuarter;
          weeklyWaste += row.duration / numWeeksInAMonth / numMonthsInAQuarter;
          monthlyWaste += row.duration / numMonthsInAQuarter;
          yearlyWaste += row.duration * numQuartersInAYear;
          break;
      }
    });

    if (!isNaN(dailyWaste)) {
      document.querySelector("span.daily-waste").innerHTML =
        this.toHoursAndMinutes(dailyWaste);
    }

    if (!isNaN(weeklyWaste)) {
      document.querySelector("span.weekly-waste").innerHTML =
        this.toHoursAndMinutes(weeklyWaste);
    }

    if (!isNaN(monthlyWaste)) {
      document.querySelector("span.monthly-waste").innerHTML =
        this.toHoursAndMinutes(monthlyWaste);
    }

    if (!isNaN(yearlyWaste)) {
      document.querySelector("span.yearly-waste").innerHTML =
        this.toHoursAndMinutes(yearlyWaste);
    }
  }
}

const app = new App();
