import apiService from "../../services/apiService";

export const handleUltrasoundSubmit = async ({
  dispatch,
  data,
  appointmentData,
  patient,
  doctor,
  showError,
}) => {
  try {
    const isUpdate = !!data._id;

    console.log(data);

    // ✅ 1. Create or update ultrasound — only add patient & appointment on create
    const ultrasoundPayload = isUpdate
      ? { ...data } // update existing record (no reassignment of patient/appointment)
      : {
          ...data,
          patient: data?.patient._id || null,
          appointment: appointmentData?._id || null,
        };

    const ultrasoundRes = isUpdate
      ? await apiService.put(
          dispatch,
          "ultrasound",
          data._id,
          ultrasoundPayload
        )
      : await apiService.post(dispatch, "ultrasound", ultrasoundPayload);

    if (!ultrasoundRes?._id) throw new Error("Failed to save ultrasound");
    const savedUltrasound = ultrasoundRes;

    // ✅ 2. If OB-related type, handle pregnancy record
    const obRelatedTypes = [
      "Biometry",
      "Biophysical Score",
      "Transvaginal Ultrasound - Gyne",
      "Transvaginal Ultrasound - OB",
    ];

    if (obRelatedTypes.includes(data?.type)) {
      const existingPregnancy = await apiService.get(dispatch, "pregnancies", {
        patient: data?.patient._id || data.patient,
        status: "active",
      });

      const pregnancyPayload = {
        patient: data?.patient._id || data.patient,
        doctor: data?.doctor._id || data.doctor,
        ultrasound: savedUltrasound._id,
        lmp: data.ob_data?.lmp || null,
        edd: data.ob_data?.edd || null,
        aog: data.ob_data?.aog || "",
        gravida_para: data.ob_data?.gravida_para || "",
        day_of_cycle: data.ob_data?.day_of_cycle || "",
        notes: data.ob_data?.notes || "",
      };

      console.log(pregnancyPayload);

      if (Array.isArray(existingPregnancy) && existingPregnancy.length > 0) {
        await apiService.put(
          dispatch,
          `pregnancies`,
          existingPregnancy[0]._id,
          pregnancyPayload
        );
      } else {
        await apiService.post(dispatch, "pregnancies", pregnancyPayload);
      }
    }

    return savedUltrasound;
  } catch (err) {
    console.error("Error saving ultrasound:", err);
    if (showError) showError("Failed to save ultrasound.");
    throw err;
  }
};
